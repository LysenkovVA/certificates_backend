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
import { CreateInspectionTypeDto } from "./dto/create-inspection-type.dto";
import { UpdateInspectionTypeDto } from "./dto/update-inspection-type.dto";
import { InspectionTypesService } from "./inspection-types.service";
import { InspectionTypeGuard } from "./inspectionType.guard";

@ApiTags("Тип проверки")
@Controller("inspection-types")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class InspectionTypesController {
    constructor(
        private readonly inspectionTypesService: InspectionTypesService,
    ) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Body() createInspectionTypeDto: CreateInspectionTypeDto,
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
    ) {
        try {
            const result = await this.inspectionTypesService.createExtended(
                createInspectionTypeDto,
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
    ) {
        try {
            const result =
                await this.inspectionTypesService.findAll(workspaceId);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(InspectionTypeGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.inspectionTypesService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(InspectionTypeGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateInspectionTypeDto: UpdateInspectionTypeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.inspectionTypesService.update(
                id,
                updateInspectionTypeDto,
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
    @UseGuards(InspectionTypeGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.inspectionTypesService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
