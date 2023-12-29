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
import { CertificateTypesService } from "./certificate-types.service";

@Injectable()
export class CertificateTypeGuard implements CanActivate {
    constructor(private certificateTypeService: CertificateTypesService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: berthTypeId } = req.params;
        const user = req.user;

        if (!berthTypeId) {
            throw new BadRequestException(
                "CertificateTypeGuard: Идентификатор типа удостоверения не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "CertificateTypeGuard: Пользователь не определен!",
            );
        }

        const result = this.certificateTypeService
            .findOne(berthTypeId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "CertificateTypeGuard: Тип удостоверения не найден!",
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
                    "CertificateTypeGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
