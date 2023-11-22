import {
    Controller,
    Get,
    Header,
    Param,
    Post,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { createReadStream } from "fs";
import path from "path";
import { FilesService } from "./files.service";
import { FILES_PATH, storage } from "./storage/storage";

@ApiTags("Файлы")
@Controller("files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    // TODO - ДОКУМЕНТАЦИЯ ДЛЯ Swagger
    // https://notiz.dev/blog/type-safe-file-uploads

    @Post("upload/:profileId/avatar")
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
        return await this.filesService.uploadAvatar(file, profileId);
    }

    @Get("download/:profileId/avatar")
    @Header("Content-Disposition", 'attachment; filename="profile.jpeg"')
    async downloadAvatar(
        @Param("profileId") profileId: string,
    ): Promise<StreamableFile> {
        const avatar = await this.filesService.downloadAvatar(profileId);

        if (avatar) {
            const downloadPath = path.resolve(FILES_PATH, avatar.path);

            console.log("Downloading file: ", downloadPath);

            const file = createReadStream(downloadPath);
            return new StreamableFile(file);
        }

        return null;
    }
}
