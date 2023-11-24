import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/roles.entity";
import { RolesService } from "./roles.service";

@ApiTags("Роли")
@Controller("roles")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({
        summary: "Создание роли пользователя",
    })
    @ApiResponse({
        status: 200,
        type: [Role],
    })
    @Post()
    async createRole(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({
        summary: "Получение роли по значению",
    })
    @ApiResponse({
        status: 200,
        type: [Role],
    })
    @Get("/:value")
    async getByValue(@Param("value") value: string) {
        return this.roleService.getRoleByValue(value);
    }

    @ApiOperation({
        summary: "Получение всех ролей",
    })
    @ApiResponse({
        status: 200,
        type: [Role],
    })
    @Get()
    async findAll() {
        return this.roleService.getAllRoles();
    }
}
