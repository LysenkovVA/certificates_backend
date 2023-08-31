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
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeesService } from "./employees.service";

@Controller("employees")
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return await this.employeesService.create(createEmployeeDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.employeesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.employeesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return await this.employeesService.update(+id, updateEmployeeDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.employeesService.remove(+id);
    }
}
