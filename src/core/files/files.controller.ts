import {
    Controller,
    Get,
    Param,
    Res,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import fs, { createReadStream } from "fs";
import path from "path";
import { AuthGuard } from "../auth/auth.guard";
import { FilesService } from "./files.service";
import { FILES_PATH } from "./storage/storage";

@ApiTags("Файлы")
@Controller("files")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get("download/:id")
    async downloadFile(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ): Promise<StreamableFile> {
        try {
            const file = await this.filesService.findOne(+id);

            if (!file) {
                return null;
            }

            const downloadPath = path.resolve(FILES_PATH, file.path);

            // Если файл не будет существовать вылетает ошибка
            // body.errorLogger is not a function
            // и она не отлавливается почему-то
            if (fs.existsSync(downloadPath)) {
                // console.log(downloadPath);
                const fileStream = createReadStream(downloadPath);
                response.set("Content-Type", file.format);
                response.set(
                    "Content-Disposition",
                    `attachment; filename="${file.name}"`,
                );
                return new StreamableFile(fileStream);
            }

            return null;
        } catch (e) {
            throw e;
        }
    }
}
