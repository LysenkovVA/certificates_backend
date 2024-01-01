import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
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
import { CertificateGuard } from "./certificate.guard";
import { CertificatesService } from "./certificates.service";
import { CreateCertificateExtendedDto } from "./dto/createCertificateExtended.dto";
import { UpdateCertificateExtendedDto } from "./dto/updateCertificateExtended.dto";

@ApiTags("Удостоверения")
@Controller("certificates")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Body() createCertificateExtendedDto: CreateCertificateExtendedDto,
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Query("organizationId") organizationId?: number,
    ) {
        try {
            const result = await this.certificatesService.createExtended(
                createCertificateExtendedDto,
                workspaceId,
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

    @Get()
    @UseGuards(WorkspaceQueryGuard)
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Query("organizationId") organizationId?: number,
    ) {
        try {
            const result = await this.certificatesService.findAll(
                workspaceId,
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
    @UseGuards(CertificateGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.certificatesService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(CertificateGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateCertificateExtendedDto: UpdateCertificateExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.certificatesService.updateExtended(
                id,
                updateCertificateExtendedDto,
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
    @UseGuards(CertificateGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.certificatesService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
