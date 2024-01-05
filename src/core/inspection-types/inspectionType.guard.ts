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
import { InspectionTypesService } from "./inspection-types.service";

@Injectable()
export class InspectionTypeGuard implements CanActivate {
    constructor(private inspectionTypeService: InspectionTypesService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: inspectionTypeId } = req.params;
        const user = req.user;

        if (!inspectionTypeId) {
            throw new BadRequestException(
                "InspectionTypeGuard: Идентификатор типа проверки не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "InspectionTypeGuard: Пользователь не определен!",
            );
        }

        const result = this.inspectionTypeService
            .findOne(inspectionTypeId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "InspectionTypeGuard: Тип проверки не найден!",
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
                    "InspectionTypeGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
