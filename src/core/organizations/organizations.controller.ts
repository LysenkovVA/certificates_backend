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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { CreateOrganizationExtendedDto } from "./dto/createOrganizationExtended.dto";
import { UpdateOrganizationExtendedDto } from "./dto/updateOrganizationExtended.dto";
import { Organization } from "./entities/organization.entity";
import { OrganizationsService } from "./organizations.service";

@ApiTags("Организации")
@Controller("organizations")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}

    @ApiOperation({
        summary: "Создание новой организации",
    })
    @ApiResponse({
        status: 200,
        type: Organization,
        description: "Созданная организация",
    })
    @ApiResponse({
        status: 500,
        description: "Ошибка на сервере",
    })
    @Post()
    async create(
        @Body() extendedOrganizationDto: CreateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.organizationsService.createExtended(
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

    @Get()
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @Query("limit") limit?: string,
        @Query("offset") offset?: string,
    ) {
        try {
            if (!limit || !offset) {
                const result = await this.organizationsService.findAll();

                if (result) {
                    response.status(200);
                    return result;
                }
            } else {
                const result = await this.organizationsService.findAll(
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
    async findOne(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.organizationsService.findOne(+id);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
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
}
