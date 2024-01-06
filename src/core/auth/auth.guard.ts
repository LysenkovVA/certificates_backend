import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
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
    async canActivate(context: ExecutionContext): Promise<boolean> {
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

                    const user = await this.userService.getUserById(id);

                    if (!user) {
                        throw new InternalServerErrorException(
                            "AUTH GUARD: Неизвестный пользователь!",
                        );
                    }
                    // ВСЕ ДОБАВЛЯЕТСЯ
                    req.user = user;
                    req.userId = user.id;

                    return true;
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
