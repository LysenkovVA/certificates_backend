import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
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
import { User } from "../users/entity/users.entity";
import { AuthUser } from "../users/user.decorator";
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
        description:
            "При создании новой организации проверяется что пользователь" +
            "является владельцем рабочего пространства, в которое добавляется организация",
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
        @AuthUser() user: User,
        @Query("workspaceId") workspaceId: string,
        @Body() extendedOrganizationDto: CreateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            if (!workspaceId) {
                throw new BadRequestException(
                    "Неправильные параметры запроса!",
                );
            }

            if (
                user.workspaces?.some((ws) => {
                    return ws.id === Number(workspaceId);
                })
            ) {
                const result = await this.organizationsService.createExtended(
                    extendedOrganizationDto,
                    +workspaceId,
                );

                if (result) {
                    response.status(200);
                    return result;
                }
            } else {
                throw new ForbiddenException("Операция запрещена!");
            }
        } catch (e) {
            throw e;
        }
    }

    @Get()
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @AuthUser() user: User,
        @Query("workspaceId") workspaceId: string,
        @Query("limit") limit?: string,
        @Query("offset") offset?: string,
    ) {
        try {
            if (!workspaceId) {
                throw new BadRequestException(
                    "Неправильные параметры запроса!",
                );
            }

            if (
                user.workspaces?.some((ws) => {
                    return ws.id === Number(workspaceId);
                })
            ) {
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
            } else {
                throw new ForbiddenException("Операция запрещена!");
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    async findOne(
        @AuthUser() user: User,
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Получаем организацию
            const organization = await this.organizationsService.findOne(+id);

            if (organization) {
                // Проверяем, что пользователю разрешено ее получить
                if (
                    user.workspaces?.some((ws) => {
                        return ws.id === Number(organization.workspace.id);
                    })
                ) {
                    response.status(200);
                    return organization;
                } else {
                    throw new ForbiddenException("Операция запрещена!");
                }
            }
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    async update(
        @AuthUser() user: User,
        @Param("id") id: string,
        @Body() extendedOrganizationDto: UpdateOrganizationExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Получаем организацию
            const organization = await this.organizationsService.findOne(+id);

            if (organization) {
                // Проверяем, что пользователю разрешено ее получить
                if (
                    user.workspaces?.some((ws) => {
                        return ws.id === Number(organization.workspace.id);
                    })
                ) {
                    const result =
                        await this.organizationsService.updateExtended(
                            +id,
                            extendedOrganizationDto,
                            organization.workspace.id,
                        );

                    if (result) {
                        response.status(200);
                        return result;
                    }
                } else {
                    throw new ForbiddenException("Операция запрещена!");
                }
            }
        } catch (e) {
            throw e;
        }
    }

    @Delete(":id")
    async remove(
        @AuthUser() user: User,
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Получаем организацию
            const organization = await this.organizationsService.findOne(+id);

            if (organization) {
                // Проверяем, что пользователю разрешено ее удалить
                if (
                    user.workspaces?.some((ws) => {
                        return ws.id === Number(organization.workspace.id);
                    })
                ) {
                    const result = await this.organizationsService.remove(+id);

                    if (result > 0) {
                        response.status(200);
                    }
                } else {
                    throw new ForbiddenException("Операция запрещена!");
                }
            }
        } catch (e) {
            throw e;
        }
    }
}
