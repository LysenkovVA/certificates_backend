import {
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
import { WorkspaceQueryGuard } from "../workspaces/workspaceQuery.guard";
import { CreateEmployeeDto } from "./dto/createEmployee.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
import { EmployeeGuard } from "./employee.guard";
import { EmployeesService } from "./employees.service";

@ApiTags("Сотрудники")
@Controller("employees")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Query("workspaceId") workspaceId: string,
        @Body() createEmployeeDto: CreateEmployeeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.employeesService.createExtended(
                createEmployeeDto,
                +workspaceId,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }

        // try {
        //     return await this.employeesService.save("", createEmployeeDto);
        // } catch (e) {
        //     throw e;
        // }
    }

    @Patch(":id")
    @UseGuards(EmployeeGuard)
    async update(
        @Param("id") id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.employeesService.updateExtended(
                +id,
                updateEmployeeDto,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }

        //return await this.employeesService.save(id, updateEmployeeDto);
    }

    @Delete(":id")
    @UseGuards(EmployeeGuard)
    async remove(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.employeesService.remove(+id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }

    @Get()
    @UseGuards(WorkspaceQueryGuard)
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId") workspaceId: string,
        @Query("limit") limit: string,
        @Query("offset") offset: string,
        @Query("searchQuery") searchQuery?: string,
    ) {
        try {
            if (!limit || !offset) {
                const result = await this.employeesService.findAll(
                    +workspaceId,
                );

                if (result) {
                    response.status(200);
                    return result;
                }
            } else {
                const result = await this.employeesService.findAll(
                    +workspaceId,
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
    @UseGuards(EmployeeGuard)
    async findOne(
        @Param("id") id: string,
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Получаем организацию
            const organization = await this.employeesService.findOne(+id);

            response.status(200);
            return organization;
        } catch (e) {
            throw e;
        }
    }
}
