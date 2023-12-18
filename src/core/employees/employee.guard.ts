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
import { EmployeesService } from "./employees.service";

@Injectable()
export class EmployeeGuard implements CanActivate {
    constructor(private employeeService: EmployeesService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: employeeId } = req.params;
        const user = req.user;

        if (!employeeId) {
            throw new BadRequestException(
                "EmployeeGuard: Идентификатор сотрудника не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "EmployeeGuard: Пользователь не определен!",
            );
        }

        const result = this.employeeService
            .findOne(employeeId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "EmployeeGuard: Сотрудник не найден!",
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
                    "EmployeeGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
