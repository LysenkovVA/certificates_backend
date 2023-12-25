import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { storage } from "../files/storage/storage";
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
    @UseInterceptors(
        FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], { storage }),
    )
    async create(
        @Query("workspaceId") workspaceId: string,
        @Body() createEmployeeDto: CreateEmployeeDto,
        @UploadedFiles() files: { avatar?: Express.Multer.File[] },
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            let avatar: Express.Multer.File = null;

            if (files && files.avatar?.length > 0) {
                avatar = files.avatar[0];
            }

            // Создаем работника
            const newEmployee = await this.employeesService.createExtended(
                +workspaceId,
                createEmployeeDto,
                avatar,
            );

            if (newEmployee) {
                response.status(200);
                return newEmployee;
            }
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(EmployeeGuard)
    @UseInterceptors(
        FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], { storage }),
    )
    async update(
        @Param("id") id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
        @UploadedFiles() files: { avatar?: Express.Multer.File[] },
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            let avatar: Express.Multer.File = null;

            if (files && files.avatar?.length > 0) {
                avatar = files.avatar[0];
            }

            const result = await this.employeesService.updateExtended(
                +id,
                updateEmployeeDto,
                avatar,
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
