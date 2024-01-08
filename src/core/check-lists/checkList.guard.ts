import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CheckListsService } from "./check-lists.service";

@Injectable()
export class CheckListGuard implements CanActivate {
    constructor(private checkListService: CheckListsService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id } = req.params;
        const user = req.user;

        if (!id) {
            throw new BadRequestException(
                "CheckListGuard: Идентификатор не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "CheckListGuard: Пользователь не определен!",
            );
        }

        const result = this.checkListService
            .findOne(id)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "CheckListGuard: Список не найден!",
                    );
                }

                if (
                    user.workspaces?.some((ws: Workspace) => {
                        return ws.id === Number(value.workspace.id);
                    })
                ) {
                    return true;
                }

                throw new ForbiddenException(
                    "CheckListGuard: Доступ запрещён!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
