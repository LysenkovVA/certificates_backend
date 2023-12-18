import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Workspace } from "./entities/workspace.entity";

/**
 * Проверка, что WorkspaceId запроса разрешен пользователю
 */
@Injectable()
export class WorkspaceQueryGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { workspaceId } = req.query;
        const user = req.user;

        if (!workspaceId) {
            throw new BadRequestException(
                "WorkspaceQueryGuard: Идентификатор рабочего пространства не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "WorkspaceQueryGuard: Пользователь не определен!",
            );
        }

        if (
            user.workspaces?.some((ws: Workspace) => {
                return ws.id === Number(workspaceId);
            })
        ) {
            return true;
        }

        throw new ForbiddenException(
            "WorkspaceQueryGuard: Данная операция запрещена!",
        );
    }
}
