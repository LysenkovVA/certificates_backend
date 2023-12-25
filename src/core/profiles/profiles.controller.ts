import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Res,
    UploadedFiles,
    UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

    @Get(":id")
    async findById(
        @Param("id") id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const candidate = await this.profilesService.findOne(+id);

            response.status(200);
            return candidate;
        } catch (e) {
            throw e;
        }
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateProfileDto: UpdateProfileDto,
        @UploadedFiles() files: { avatar?: Express.Multer.File[] },
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            let avatar: Express.Multer.File = null;

            if (files && files.avatar?.length > 0) {
                avatar = files.avatar[0];
            }

            const result = await this.profilesService.update(
                +id,
                updateProfileDto,
                avatar,
            );

            if (result) {
                response.status(200);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }
}
