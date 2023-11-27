import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

/**
 * Проверка, что пользователь авторизован
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        console.log("AUTH GUARD: Get request");
        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                console.log("AUTH GUARD: Get auth headers");
                const bearer = authHeader.split(" ")[0];
                const token = authHeader.split(" ")[1];

                if (bearer !== "Bearer" || !token) {
                    new UnauthorizedException({
                        message: "Пользователь не авторизован",
                    });
                }

                //req.user = this.jwtService.verify(token);
                try {
                    console.log("AUTH GUARD: Verify token");
                    this.jwtService.verify(token, {
                        secret: this.configService.get<string>(
                            "JWT_ACCESS_TOKEN_KEY",
                        ),
                    });

                    console.log("AUTH GUARD: Return true");
                    return true;
                } catch {
                    console.log("AUTH GUARD: Catch");
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
