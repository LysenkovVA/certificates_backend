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
import { CreateInspectionExtendedDto } from "./dto/createInspectionExtended.dto";
import { UpdateInspectionExtendedDto } from "./dto/updateInspectionExtended.dto";
import { InspectionGuard } from "./inspection.guard";
import { InspectionsService } from "./inspections.service";

@ApiTags("Проверки")
@Controller("inspections")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class InspectionsController {
    constructor(private readonly inspectionsService: InspectionsService) {}

    @Post("create")
    @UseGuards(WorkspaceQueryGuard)
    async create(
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Body() createInspectionExtendedDto: CreateInspectionExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            // Создаем работника
            const newInspection = await this.inspectionsService.createExtended(
                workspaceId,
                createInspectionExtendedDto,
            );

            if (newInspection) {
                response.status(200);
                return newInspection;
            }
        } catch (e) {
            throw e;
        }
    }

    // @Post("upload/avatar/:employeeId")
    // @UseInterceptors(FileInterceptor("avatar", { storage }))
    // async uploadAvatar(
    //     @Param("employeeId", ParseIntPipe) employeeId: number,
    //     @UploadedFile() avatar: Express.Multer.File,
    //     @Res({ passthrough: true }) response: Response,
    // ) {
    //     try {
    //         const file = await this.employeesService.uploadAvatar(
    //             avatar,
    //             employeeId,
    //         );
    //
    //         if (file) {
    //             response.status(200);
    //             return file;
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    // @Post("delete/avatar/:employeeId")
    // async deleteAvatar(
    //     @Param("employeeId", ParseIntPipe) employeeId: number,
    //     @Res({ passthrough: true }) response: Response,
    // ) {
    //     try {
    //         const result = await this.employeesService.deleteAvatar(employeeId);
    //
    //         if (result) {
    //             response.status(200);
    //             return result;
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    @Patch(":id")
    @UseGuards(InspectionGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateInspectionExtendedDto: UpdateInspectionExtendedDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.inspectionsService.updateExtended(
                id,
                updateInspectionExtendedDto,
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
    @UseGuards(InspectionGuard)
    async remove(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.inspectionsService.removeExtended(id);

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
        @Query("workspaceId", ParseIntPipe) workspaceId: number,
        @Query("limit") limit?: number,
        @Query("offset") offset?: number,
        @Query("searchQuery") searchQuery?: string,
    ) {
        try {
            const result = await this.inspectionsService.findAll(
                workspaceId,
                limit,
                offset,
                searchQuery,
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
    @UseGuards(InspectionGuard)
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.inspectionsService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }
}
