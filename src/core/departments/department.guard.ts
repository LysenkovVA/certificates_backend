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
import { DepartmentsService } from "./departments.service";

@Injectable()
export class DepartmentGuard implements CanActivate {
    constructor(private departmentService: DepartmentsService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: departmentId } = req.params;
        const user = req.user;

        if (!departmentId) {
            throw new BadRequestException(
                "DepartmentGuard: Идентификатор подразделения не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "DepartmentGuard: Пользователь не определен!",
            );
        }

        const result = this.departmentService
            .findOne(departmentId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "DepartmentGuard: Подразделение не найдено!",
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
                    "DepartmentGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
