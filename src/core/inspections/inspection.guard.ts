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
import { InspectionsService } from "./inspections.service";

@Injectable()
export class InspectionGuard implements CanActivate {
    constructor(private inspectionService: InspectionsService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: inspectionId } = req.params;
        const user = req.user;

        if (!inspectionId) {
            throw new BadRequestException(
                "InspectionGuard: Идентификатор проверки не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "InspectionGuard: Пользователь не определен!",
            );
        }

        const result = this.inspectionService
            .findOne(inspectionId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "InspectionGuard: Проверка не найдена!",
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
                    "InspectionGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
