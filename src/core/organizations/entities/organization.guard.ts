import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Workspace } from "../../workspaces/entities/workspace.entity";
import { OrganizationsService } from "../organizations.service";

@Injectable()
export class OrganizationGuard implements CanActivate {
    constructor(private organizationService: OrganizationsService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: organizationId } = req.params;
        const user = req.user;

        if (!organizationId) {
            throw new BadRequestException(
                "OrganizationGuard: Идентификатор организации не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "OrganizationGuard: Пользователь не определен!",
            );
        }

        const result = this.organizationService
            .findOne(organizationId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "OrganizationGuard: Организация не найдена!",
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
                    "OrganizationGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
