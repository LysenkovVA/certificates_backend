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
import { ConstructionObjectsService } from "./construction-objects.service";

@Injectable()
export class ConstructionObjectGuard implements CanActivate {
    constructor(
        private constructionObjectsService: ConstructionObjectsService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: coId } = req.params;
        const user = req.user;

        if (!coId) {
            throw new BadRequestException(
                "ConstructionObjectGuard: Идентификатор объекта не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "ConstructionObjectGuard: Пользователь не определен!",
            );
        }

        const result = this.constructionObjectsService
            .findOne(coId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "ConstructionObjectGuard: Объект не найден!",
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
                    "ConstructionObjectGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
