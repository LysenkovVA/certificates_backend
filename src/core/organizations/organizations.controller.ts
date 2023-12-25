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
import { CreateOrganizationExtendedDto } from "./dto/createOrganizationExtended.dto";
import { UpdateOrganizationExtendedDto } from "./dto/updateOrganizationExtended.dto";
import { OrganizationGuard } from "./organization.guard";
import { OrganizationsService } from "./organizations.service";

@ApiTags("Организации")
@Controller("organizations")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Query("workspaceId") workspaceId: string,
        @Body() extendedOrganizationDto: CreateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.organizationsService.createExtended(
                extendedOrganizationDto,
                +workspaceId,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(OrganizationGuard)
    async update(
        @Param("id") id: string,
        @Body() extendedOrganizationDto: UpdateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.organizationsService.updateExtended(
                +id,
                extendedOrganizationDto,
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
    @UseGuards(OrganizationGuard)
    async remove(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.organizationsService.remove(+id);

            if (result > 0) {
                response.status(200);
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
        @Query("limit") limit?: string,
        @Query("offset") offset?: string,
    ) {
        try {
            if (!limit || !offset) {
                const result = await this.organizationsService.findAll(
                    +workspaceId,
                );

                if (result) {
                    response.status(200);
                    return result;
                }
            } else {
                const result = await this.organizationsService.findAll(
                    +workspaceId,
                    +limit,
                    +offset,
                );
                if (result) {
                    response.status(200);
                    return result;
                }
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(OrganizationGuard)
    async findOne(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Получаем организацию
            const organization = await this.organizationsService.findOne(+id);

            response.status(200);
            return organization;
        } catch (e) {
            throw e;
        }
    }
}
