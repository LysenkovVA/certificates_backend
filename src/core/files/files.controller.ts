import {
    Controller,
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
import { createReadStream } from "fs";
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
}
