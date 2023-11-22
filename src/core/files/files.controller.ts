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
import { storage } from "./storage/storage";

const uploadPath = path.resolve(__dirname, "../../../uploadFiles");

// const storage = diskStorage({
//     destination: (req, file, callBack) => {
//         console.log("URL: ", req.url);
//
//         const { profileId } = req.params;
//
//         let dir = "";
//
//         if (req.url.includes("avatar")) {
//             dir = path.resolve(
//                 __dirname,
//                 "../../../uploadFiles",
//                 profileId,
//                 "profile",
//             );
//         }
//
//         if (!dir) {
//             callBack(
//                 new Error(
//                     "DISK STORAGE: URL для загрузки изображений не известен",
//                 ),
//                 dir,
//             );
//         }
//
//         try {
//             if (!fs.existsSync(dir)) {
//                 fs.mkdirSync(dir, { recursive: true });
//             }
//         } catch (e) {
//             callBack(e, dir);
//         }
//
//         callBack(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const extension = extname(file.originalname);
//
//         // const name = file.originalname.split(".")[0];
//         // const extension = extname(file.originalname);
//         // const randomName = Array(32)
//         //     .fill(null)
//         //     .map(() => Math.round(Math.random() * 16).toString(16))
//         //     .join("");
//         // cb(null, `${name}-${randomName}${extension}`);
//
//         cb(null, `profile${extension}`);
//     },
// });

@ApiTags("Файлы")
@Controller("files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    // TODO - ДОКУМЕНТАЦИЯ ДЛЯ Swagger
    // https://notiz.dev/blog/type-safe-file-uploads

    /**
     * Загрузка аватара профиля
     * @param profileId
     * @param file
     */
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
        console.log("Uploaded file: " + file);
        // Сохраняем информацию в БД дальше
        return await this.filesService.upload(file);
    }

    @Post("upload/:userId/profile/")
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
    async uploadProfile(
        @Param("userId") userId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // Файл загрузился
        console.log("Uploaded file: " + file);
        // Сохраняем информацию в БД дальше
        return "";
    }

    @Get("download/:profileId/avatar")
    @Header("Content-Disposition", 'attachment; filename="profile.jpeg"')
    getFile(@Param("profileId") profileId: string): StreamableFile {
        const downloadPath = path.resolve(
            __dirname,
            "../../../uploadFiles",
            profileId,
            "profile",
            "profile.jpeg",
        );

        console.log("Downloading file: ", downloadPath);
        //const file = createReadStream(join(uploadPath, fileName));
        const file = createReadStream(downloadPath);
        return new StreamableFile(file);
    }

    // @Post()
    // async create(@Body() createFileDto: CreateFileDto) {
    //     return await this.filesService.create(createFileDto);
    // }
    //
    // @Get(":id")
    // async findOne(@Param("id") id: string) {
    //     return await this.filesService.findOne(+id);
    // }
    //
    // @Delete(":id")
    // async remove(@Param("id") id: string) {
    //     return await this.filesService.remove(+id);
    // }
}
