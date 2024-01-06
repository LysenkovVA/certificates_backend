import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Res,
} from "@nestjs/common";
import { Response } from "express";
import { User } from "../users/entity/users.entity";
import { AuthUser } from "../users/user.decorator";
import { CreateWorkspaceExtendedDto } from "./dto/createWorkspaceExtended.dto";
import { UpdateWorkspaceExtendedDto } from "./dto/updateWorkspaceExtended.dto";
import { WorkspacesService } from "./workspaces.service";

@Controller("workspaces")
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Post("create")
    async create(
        @AuthUser() user: User,
        @Body() createWorkspaceExtendedDto: CreateWorkspaceExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.workspacesService.createExtended(
                createWorkspaceExtendedDto,
                user.id,
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
    async findAll(
        @AuthUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.workspacesService.findAll(user.id);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Get(":id")
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.workspacesService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateWorkspaceExtendedDto: UpdateWorkspaceExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.workspacesService.updateExtended(
                id,
                updateWorkspaceExtendedDto,
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
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.workspacesService.remove(id);

            if (result > 0) {
                response.status(200);
            }
        } catch (e) {
            throw e;
        }
    }
}
