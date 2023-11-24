import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { AccessRightsService } from "./access-rights.service";
import { CreateAccessRightDto } from "./dto/create-access-right.dto";
import { UpdateAccessRightDto } from "./dto/update-access-right.dto";

@ApiTags("Права доступа")
@Controller("access-rights")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class AccessRightsController {
    constructor(private readonly accessRightsService: AccessRightsService) {}

    @ApiOperation({
        summary: "Создание права доступа",
    })
    @Post()
    async create(@Body() createAccessRightDto: CreateAccessRightDto) {
        return await this.accessRightsService.create(createAccessRightDto);
    }

    @ApiOperation({
        summary: "Получение всех прав доступа",
    })
    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.accessRightsService.findAll(+limit, +offset);
    }

    @ApiOperation({
        summary: "Получение права доступа по id",
    })
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.accessRightsService.findOne(+id);
    }

    @ApiOperation({
        summary: "Обновление права доступа по id",
    })
    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateAccessRightDto: UpdateAccessRightDto,
    ) {
        return await this.accessRightsService.update(+id, updateAccessRightDto);
    }

    @ApiOperation({
        summary: "Удаление права доступа по id",
    })
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.accessRightsService.remove(+id);
    }
}
