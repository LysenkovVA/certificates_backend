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
import { BerthGuard } from "./berth.guard";
import { BerthesService } from "./berthes.service";
import { CreateBerthExtendedDto } from "./dto/createBerthExtended.dto";
import { UpdateBerthExtendedDto } from "./dto/updateBerthExtended.dto";

@ApiTags("Должности")
@Controller("berthes")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class BerthesController {
    constructor(private readonly berthesService: BerthesService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Body() createBertheDto: CreateBerthExtendedDto,
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
    ) {
        try {
            const result = await this.berthesService.createExtended(
                createBertheDto,
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
            const result = await this.berthesService.findAll(workspaceId);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(BerthGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.berthesService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(BerthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateBertheDto: UpdateBerthExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthesService.updateExtended(
                id,
                updateBertheDto,
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
    @UseGuards(BerthGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthesService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
