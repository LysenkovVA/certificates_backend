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
import { BerthTypeGuard } from "./berth-type.guard";
import { BerthTypesService } from "./berth-types.service";
import { CreateBerthTypeDto } from "./dto/create-berth-type.dto";
import { UpdateBerthTypeDto } from "./dto/update-berth-type.dto";

@ApiTags("Типы должностей")
@Controller("berth-types")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class BerthTypesController {
    constructor(private readonly berthTypesService: BerthTypesService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Body() createBerthTypeDto: CreateBerthTypeDto,
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
    ) {
        try {
            const result = await this.berthTypesService.createExtended(
                createBerthTypeDto,
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
            const result = await this.berthTypesService.findAll(workspaceId);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(BerthTypeGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.berthTypesService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(BerthTypeGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateBerthTypeDto: UpdateBerthTypeDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthTypesService.update(
                id,
                updateBerthTypeDto,
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
    @UseGuards(BerthTypeGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthTypesService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
