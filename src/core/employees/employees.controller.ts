import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeesService } from "./employees.service";

@ApiTags("Сотрудники")
@Controller("employees")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
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
        @Query("searchQuery") searchQuery?: string,
    ) {
        return await this.employeesService.findAll(
            +limit,
            +offset,
            searchQuery,
        );
    }

    @Get(":id")
    async findOne(
        @Param("id") id: string,
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const employee = await this.employeesService.findOne(+id);

        if (!employee) {
            throw new BadRequestException("Нет такого сотрудника на сервере!");
        } else {
            return employee;
        }
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
