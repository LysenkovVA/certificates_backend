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
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { WorkspaceQueryGuard } from "../workspaces/workspaceQuery.guard";
import { BerthGuard } from "./berth.guard";
import { BerthesService } from "./berthes.service";
import { CreateBerthDto } from "./dto/create-berth.dto";
import { UpdateBerthDto } from "./dto/update-berth.dto";

@ApiTags("Должности")
@Controller("berthes")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class BerthesController {
    constructor(private readonly berthesService: BerthesService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Query("workspaceId") workspaceId: string,
        @Query("organizationId") organizationId: string,
        @Body() createBertheDto: CreateBerthDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthesService.createExtended(
                createBertheDto,
                +workspaceId,
                +organizationId,
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
        @Query("workspaceId") workspaceId: string,
        @Query("organizationId") organizationId: string,
    ) {
        try {
            const result = await this.berthesService.findAll(
                +workspaceId,
                organizationId,
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
    @UseGuards(BerthGuard)
    async findOne(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.berthesService.findOne(+id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(BerthGuard)
    async update(
        @Param("id") id: string,
        @Body() updateBertheDto: UpdateBerthDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthesService.updateExtended(
                +id,
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
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.berthesService.remove(+id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
