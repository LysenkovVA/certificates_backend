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
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { DepartmentsService } from "./departments.service";
import { CreateDepartmentDto } from "./dto/createDepartment.dto";
import { UpdateDepartmentDto } from "./dto/updateDepartment.dto";

@ApiTags("Подразделения")
@Controller("departments")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}

    @Post()
    async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        return await this.departmentsService.create(createDepartmentDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit?: string,
        @Query("offset") offset?: string,
    ) {
        if (!limit || !offset) {
            return await this.departmentsService.findAll();
        } else {
            return await this.departmentsService.findAll(+limit, +offset);
        }
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.departmentsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ) {
        return await this.departmentsService.update(+id, updateDepartmentDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.departmentsService.remove(+id);
    }
}
