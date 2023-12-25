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
import { BerthesService } from "./berthes.service";

@Injectable()
export class BerthGuard implements CanActivate {
    constructor(private berthService: BerthesService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { id: berthId } = req.params;
        const user = req.user;

        if (!berthId) {
            throw new BadRequestException(
                "BerthGuard: Идентификатор должности не указан!",
            );
        }

        if (!user) {
            throw new BadRequestException(
                "BerthGuard: Пользователь не определен!",
            );
        }

        const result = this.berthService
            .findOne(berthId)
            .then((value) => {
                if (!value) {
                    throw new InternalServerErrorException(
                        "BerthGuard: Должность не найдена!",
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
                    "BerthGuard: Данная операция запрещена!",
                );
            })
            .catch((error) => {
                return false;
            });

        return result;
    }
}
