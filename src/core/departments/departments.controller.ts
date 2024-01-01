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
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { WorkspaceQueryGuard } from "../workspaces/workspaceQuery.guard";
import { DepartmentGuard } from "./department.guard";
import { DepartmentsService } from "./departments.service";
import { CreateDepartmentExtendedDto } from "./dto/createDepartmentExtended.dto";
import { UpdateDepartmentDto } from "./dto/updateDepartment.dto";

@ApiTags("Подразделения")
@Controller("departments")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Body() createDepartmentDto: CreateDepartmentExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.departmentsService.createExtended(
                createDepartmentDto,
                workspaceId,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get()
    @UseGuards(WorkspaceQueryGuard)
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Query("organizationId") organizationId?: number,
        @Query("limit") limit?: number,
        @Query("offset") offset?: number,
    ) {
        try {
            const result = await this.departmentsService.findAll(
                workspaceId,
                organizationId,
                limit,
                offset,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(DepartmentGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.departmentsService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(DepartmentGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.departmentsService.updateExtended(
                id,
                updateDepartmentDto,
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
    @UseGuards(DepartmentGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.departmentsService.remove(+id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
