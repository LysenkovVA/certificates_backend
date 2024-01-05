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
import { ConstructionObjectsService } from "./construction-objects.service";
import { ConstructionObjectGuard } from "./constructionObject.guard";
import { CreateConstructionObjectExtendedDto } from "./dto/createConstructionObjectExtended.dto";
import { UpdateConstructionObjectExtendedDto } from "./dto/updateConstructionObjectExtended.dto";

@ApiTags("Строительные объекты")
@Controller("construction-objects")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class ConstructionObjectsController {
    constructor(
        private readonly constructionObjectsService: ConstructionObjectsService,
    ) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Body()
        createConstructionObjectExtendedDto: CreateConstructionObjectExtendedDto,
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Query("organizationId") organizationId?: number,
    ) {
        try {
            const result = await this.constructionObjectsService.createExtended(
                createConstructionObjectExtendedDto,
                workspaceId,
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

    @Get()
    @UseGuards(WorkspaceQueryGuard)
    async findAll(
        @Res({ passthrough: true }) response: Response,
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Query("organizationId") organizationId?: number,
    ) {
        try {
            const result = await this.constructionObjectsService.findAll(
                workspaceId,
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
    @UseGuards(ConstructionObjectGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.constructionObjectsService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(ConstructionObjectGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body()
        updateConstructionObjectExtendedDto: UpdateConstructionObjectExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.constructionObjectsService.updateExtended(
                id,
                updateConstructionObjectExtendedDto,
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
    @UseGuards(ConstructionObjectGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.constructionObjectsService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
