import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { UsersService } from "../users/users.service";

/**
 * Проверка, что пользователь авторизован
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userService: UsersService,
    ) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const bearer = authHeader.split(" ")[0];
                const token = authHeader.split(" ")[1];

                if (bearer !== "Bearer" || !token) {
                    new UnauthorizedException({
                        message: "Пользователь не авторизован",
                    });
                }

                try {
                    this.jwtService.verify(token, {
                        secret: this.configService.get<string>(
                            "JWT_ACCESS_TOKEN_KEY",
                        ),
                    });

                    // Добавляем в запрос userId
                    const payload = this.jwtService.decode(token);

                    const { id } = JSON.parse(JSON.stringify(payload));

                    if (!id) {
                        throw new InternalServerErrorException(
                            "AUTH GUARD: Не удалось получить идентификатор пользователя из запроса!",
                        );
                    }

                    // req.userId = id;
                    // return true;

                    const result = this.userService
                        .getUserById(id)
                        .then((value) => {
                            if (!value) {
                                throw new InternalServerErrorException(
                                    "AUTH GUARD: Неизвестный пользователь!",
                                );
                            }

                            req.userId = id;
                            req.user = value;
                            return true;
                        })
                        .catch((error) => {
                            return false;
                        });

                    return result;

                    // console.log(`>> AUTH GUARD for '${req.path}': Granted!`);
                } catch {
                    console.log(`>> AUTH GUARD for '${req.path}': DENIED!`);
                    throw new UnauthorizedException({
                        message: "Пользователь не авторизован",
                    });
                }
            }

            new UnauthorizedException({
                message: "Пользователь не авторизован",
            });
        } catch (e) {
            throw e;
        }
    }
}
