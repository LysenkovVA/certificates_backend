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
import { CertificatesService } from "./certificates.service";

@Injectable()
export class CertificateGuard implements CanActivate {
    constructor(private certificateService: CertificatesService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: certificateId } = req.params;
        const user = req.user;

        if (!certificateId) {
            throw new BadRequestException(
                "CertificateGuard: Идентификатор удостоверения не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "CertificateGuard: Пользователь не определен!",
            );
        }

        const result = this.certificateService
            .findOne(certificateId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "CertificateGuard: Удостоверение не найдено!",
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
                    "CertificateGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
