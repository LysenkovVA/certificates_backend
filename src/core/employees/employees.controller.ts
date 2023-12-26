import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { storage } from "../files/storage/storage";
import { WorkspaceQueryGuard } from "../workspaces/workspaceQuery.guard";
import { CreateEmployeeExtendedDto } from "./dto/createEmployeeExtended.dto";
import { UpdateEmployeeExtendedDto } from "./dto/updateEmployeeExtended.dto";
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
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Body() createEmployeeDto: CreateEmployeeExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Создаем работника
            const newEmployee = await this.employeesService.createExtended(
                workspaceId,
                createEmployeeDto,
            );

            if (newEmployee) {
                response.status(200);
                return newEmployee;
            }
        } catch (e) {
            throw e;
        }
    }

    @Post("upload/avatar/:employeeId")
    @UseInterceptors(FileInterceptor("avatar", { storage }))
    async uploadAvatar(
        @Param("employeeId", ParseIntPipe) employeeId: number,
        @UploadedFile() avatar: Express.Multer.File,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const file = await this.employeesService.uploadAvatar(
                avatar,
                employeeId,
            );

            if (file) {
                response.status(200);
                return file;
            }
        } catch (e) {
            throw e;
        }
    }

    @Post("delete/avatar/:employeeId")
    async deleteAvatar(
        @Param("employeeId", ParseIntPipe) employeeId: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.employeesService.deleteAvatar(employeeId);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(EmployeeGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateEmployeeDto: UpdateEmployeeExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.employeesService.updateExtended(
                id,
                updateEmployeeDto,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Delete(":id")
    @UseGuards(EmployeeGuard)
    async remove(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.employeesService.removeExtended(+id);

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
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.employeesService.findOne(+id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }
}
