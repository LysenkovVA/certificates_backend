import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Controller("departments")
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}

    @Post()
    async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        return await this.departmentsService.create(createDepartmentDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.departmentsService.findAll(+limit, +offset);
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
