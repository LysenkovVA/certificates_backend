import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { BerthesService } from "./berthes.service";
import { CreateBerthDto } from "./dto/create-berth.dto";
import { UpdateBerthDto } from "./dto/update-berth.dto";

@ApiTags("Должности")
@Controller("berthes")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class BerthesController {
    constructor(private readonly berthesService: BerthesService) {}

    @Post()
    async create(@Body() createBertheDto: CreateBerthDto) {
        return await this.berthesService.create(createBertheDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.berthesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.berthesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateBertheDto: UpdateBerthDto,
    ) {
        return await this.berthesService.update(+id, updateBertheDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.berthesService.remove(+id);
    }
}
