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
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { WorkspaceQueryGuard } from "../workspaces/workspaceQuery.guard";
import { CheckListsService } from "./check-lists.service";
import { CheckListGuard } from "./checkList.guard";
import { CreateCheckListExtendedDto } from "./dto/createCheckListExtended.dto";
import { UpdateCheckListExtendedDto } from "./dto/updateCheckListExtended.dto";

@Controller("check-lists")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class CheckListsController {
    constructor(private readonly checkListsService: CheckListsService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Body() createCheckListExtendedDto: CreateCheckListExtendedDto,
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
    ) {
        try {
            const result = await this.checkListsService.createExtended(
                createCheckListExtendedDto,
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
            const result = await this.checkListsService.findAll(workspaceId);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    @UseGuards(CheckListGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.checkListsService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(CheckListGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateCheckListExtendedDto: UpdateCheckListExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.checkListsService.updateExtended(
                id,
                updateCheckListExtendedDto,
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
    @UseGuards(CheckListGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.checkListsService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
