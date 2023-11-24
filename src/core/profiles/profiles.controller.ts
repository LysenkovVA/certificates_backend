import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

    @Post()
    create(@Body() createProfileDto: CreateProfileDto) {
        return this.profilesService.create(createProfileDto);
    }

    @Get()
    findAll() {
        return this.profilesService.findAll();
    }

    @Get(":userId")
    async fetchByUserId(@Param("userId") userId: string) {
        return await this.profilesService.fetchByUserId(+userId);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return await this.profilesService.update(+id, updateProfileDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.profilesService.remove(+id);
    }
}
