import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
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
    constructor(
        private readonly organizationsService: OrganizationsService,
        private readonly jwtService: JwtService,
    ) {}

    getUserIdFromRequest(request: Request): number {
        if (!request) {
            return null;
        }

        const payload = this.jwtService.decode(
            request.headers?.authorization?.split(" ")?.[1],
        );

        const { id } = JSON.parse(JSON.stringify(payload));

        if (!id) {
            throw new InternalServerErrorException(
                "Не удалось получить идентификатор пользователя из запроса!",
            );
        }

        return Number(id);
    }

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
    @Post("create")
    async create(
        @Req() request: Request,
        @Body() extendedOrganizationDto: CreateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const userId = this.getUserIdFromRequest(request);

            const result = await this.organizationsService.createExtended(
                extendedOrganizationDto,
                userId,
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
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @Query("limit") limit?: string,
        @Query("offset") offset?: string,
    ) {
        try {
            const id = this.getUserIdFromRequest(request);

            if (!limit || !offset) {
                const result = await this.organizationsService.findAll(id);

                if (result) {
                    response.status(200);
                    return result;
                }
            } else {
                const result = await this.organizationsService.findAll(
                    id,
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
        @Req() request: Request,
        @Param("id") id: string,
        @Body() extendedOrganizationDto: UpdateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const userId = this.getUserIdFromRequest(request);

            const result = await this.organizationsService.updateExtended(
                +id,
                extendedOrganizationDto,
                userId,
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
