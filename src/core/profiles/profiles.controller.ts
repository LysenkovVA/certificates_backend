import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { storage } from "../files/storage/storage";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

    @Get(":id")
    async findById(
        @Param("id", ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.profilesService.findOne(id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Post("upload/avatar/:profileId")
    @UseInterceptors(FileInterceptor("avatar", { storage }))
    async uploadAvatar(
        @Param("profileId", ParseIntPipe) profileId: number,
        @UploadedFile() avatar: Express.Multer.File,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const file = await this.profilesService.uploadAvatar(
                avatar,
                profileId,
            );

            if (file) {
                response.status(200);
                return file;
            }
        } catch (e) {
            throw e;
        }
    }

    @Post("delete/avatar/:profileId")
    async deleteAvatar(
        @Param("profileId", ParseIntPipe) profileId: number,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.profilesService.deleteAvatar(profileId);

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateProfileDto: UpdateProfileDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const result = await this.profilesService.update(
                id,
                updateProfileDto,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    // @Patch(":id")
    // @UseInterceptors(
    //     FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], { storage }),
    // )
    // async update(
    //     @Param("id", ParseIntPipe) id: number,
    //     @Body() updateProfileDto: UpdateProfileDto,
    //     @UploadedFiles() files: { avatar?: Express.Multer.File[] },
    //     @Res({ passthrough: true }) response: Response,
    // ) {
    //     try {
    //         let avatar: Express.Multer.File = null;
    //
    //         if (files && files.avatar?.length > 0) {
    //             avatar = files.avatar[0];
    //         }
    //
    //         const result = await this.profilesService.update(
    //             id,
    //             updateProfileDto,
    //             avatar,
    //         );
    //
    //         if (result) {
    //             response.status(200);
    //             return result;
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // }
}
