import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

/**
 * Проверка, что пользователь авторизован
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
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

                //req.user = this.jwtService.verify(token);
                this.jwtService.verify(token);
                return true;
            }

            new UnauthorizedException({
                message: "Пользователь не авторизован",
            });
        } catch (e) {
            throw e;
        }
    }
}
