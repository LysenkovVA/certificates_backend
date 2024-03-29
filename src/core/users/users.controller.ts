import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { User } from "./entity/users.entity";
import { UsersService } from "./users.service";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({
        summary: "Получение всех пользователей",
    })
    @ApiResponse({
        status: 200,
        type: [User],
    })
    // @UseGuards(AuthGuard)
    // Доступно только для администратора
    // @Roles("ADMIN")
    // @UseGuards(RolesGuard)
    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({
        summary: "Выдать роль",
    })
    @ApiResponse({
        status: 200,
    })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post("/role")
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    // @Patch(":id")
    // async update(
    //     @Param("id") id: string,
    //     @Body() updateUserDto: UpdateUserDto,
    // ) {
    //     return await this.usersService.update(+id, updateUserDto);
    // }
    //
    @Get(":id")
    @UseGuards(AuthGuard)
    async getById(@Param("id") id: string) {
        return await this.usersService.getUserById(+id);
    }
}
