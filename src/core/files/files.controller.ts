import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import fs, { createReadStream } from "fs";
import path from "path";
import { AuthGuard } from "../auth/auth.guard";
import { FilesService } from "./files.service";
import { FILES_PATH, storage } from "./storage/storage";

@ApiTags("Файлы")
@Controller("files")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    // TODO - ДОКУМЕНТАЦИЯ ДЛЯ Swagger
    // https://notiz.dev/blog/type-safe-file-uploads

    @Post("upload/avatar/:profileId")
    @UseInterceptors(FileInterceptor("file", { storage })) // 👈 field name must match
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    // 👈 this property
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    async uploadAvatar(
        @Param("profileId") profileId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // Файл загрузился
        console.log("Uploaded file: " + JSON.stringify(file));
        // Сохраняем информацию в БД дальше
        return await this.filesService.uploadProfileAvatar(file, +profileId);
    }

    @Post("upload/employee/:employeeId")
    @UseInterceptors(FileInterceptor("file", { storage })) // 👈 field name must match
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    // 👈 this property
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    async uploadEmployeePhoto(
        @Param("employeeId") employeeId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // Файл загрузился
        console.log("Uploaded file: " + JSON.stringify(file));
        // Сохраняем информацию в БД дальше
        return await this.filesService.uploadEmployeeAvatar(file, +employeeId);
    }

    @Get("download/:id")
    async downloadFile(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ): Promise<StreamableFile> {
        const file = await this.filesService.findOne(+id);

        if (!file) {
            return null;
        }

        const downloadPath = path.resolve(FILES_PATH, file.path);
        const fileStream = createReadStream(downloadPath);
        response.set("Content-Type", file.format);
        response.set(
            "Content-Disposition",
            `attachment; filename="${file.name}"`,
        );
        console.log("Downloading file: " + file.name);
        return new StreamableFile(fileStream);
    }

    @Delete(":id")
    async deleteFile(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        console.log(">>>>>> DELETE");
        // Удаляем из храннилища
        const file = await this.filesService.findOne(+id);

        if (file) {
            const filePath = path.resolve(FILES_PATH, file.name);

            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath);

                // Удаляем из БД
                await this.filesService.remove(+id);
                response.status(200);
            } else {
                console.log(">>> FILE NOT FOUND at path: " + filePath);
                response.status(500);
            }
        } else {
            console.log(">>> FILE NOT FOUND AT DB");
            response.status(500);
        }
    }
}
