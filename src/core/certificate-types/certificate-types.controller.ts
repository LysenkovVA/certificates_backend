import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { WorkspaceQueryGuard } from "../workspaces/workspaceQuery.guard";
import { CertificateTypesService } from "./certificate-types.service";
import { CertificateTypeGuard } from "./certificateType.guard";
import { CreateCertificateTypeDto } from "./dto/create-certificate-type.dto";
import { UpdateCertificateTypeDto } from "./dto/update-certificate-type.dto";

@ApiTags("Типы удостоверений")
@Controller("certificate-types")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class CertificateTypesController {
    constructor(
        private readonly certificateTypesService: CertificateTypesService,
    ) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Query("workspaceId") workspaceId: string,
        @Query("organizationId") organizationId: string,
        @Body() createCertificateTypeDto: CreateCertificateTypeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.certificateTypesService.createExtended(
                createCertificateTypeDto,
                +workspaceId,
                +organizationId,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get()
    @UseGuards(WorkspaceQueryGuard)
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId") workspaceId: string,
        @Query("organizationId") organizationId: string,
    ) {
        try {
            const result = await this.certificateTypesService.findAll(
                +workspaceId,
                organizationId,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(CertificateTypeGuard)
    async findOne(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.certificateTypesService.findOne(+id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(CertificateTypeGuard)
    async update(
        @Param("id") id: string,
        @Body() updateCertificateTypeDto: UpdateCertificateTypeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.certificateTypesService.update(
                +id,
                updateCertificateTypeDto,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Delete(":id")
    @UseGuards(CertificateTypeGuard)
    async remove(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.certificateTypesService.remove(+id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
