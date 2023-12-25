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
import { BerthTypesService } from "./berth-types.service";

@Injectable()
export class BerthTypeGuard implements CanActivate {
    constructor(private berthTypeService: BerthTypesService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: berthTypeId } = req.params;
        const user = req.user;

        if (!berthTypeId) {
            throw new BadRequestException(
                "BerthTypeGuard: Идентификатор типа должности не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "BerthTypeGuard: Пользователь не определен!",
            );
        }

        const result = this.berthTypeService
            .findOne(berthTypeId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "BerthTypeGuard: Тип должности не найдена!",
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
                    "BerthTypeGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
