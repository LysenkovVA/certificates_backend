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
import { EmployeeDto } from "./dto/employee.dto";
import { EmployeesService } from "./employees.service";

@ApiTags("Сотрудники")
@Controller("employees")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post("create")
    async create(
        @Body() createEmployeeDto: EmployeeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            return await this.employeesService.save("", createEmployeeDto);
        } catch (e) {
            response.status(500);
            response.statusMessage = e;
        }
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateEmployeeDto: EmployeeDto,
    ) {
        return await this.employeesService.save(id, updateEmployeeDto);
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

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.employeesService.remove(+id);
    }
}
