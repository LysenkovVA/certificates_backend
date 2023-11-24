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
import { CheckStatusesService } from "./check-statuses.service";
import { CreateCheckStatusDto } from "./dto/create-check-status.dto";
import { UpdateCheckStatusDto } from "./dto/update-check-status.dto";

@ApiTags("Статус проверки нарушения")
@Controller("check-statuses")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class CheckStatusesController {
    constructor(private readonly checkStatusesService: CheckStatusesService) {}

    @Post()
    async create(@Body() createCheckStatusDto: CreateCheckStatusDto) {
        return await this.checkStatusesService.create(createCheckStatusDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return this.checkStatusesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.checkStatusesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCheckStatusDto: UpdateCheckStatusDto,
    ) {
        return await this.checkStatusesService.update(
            +id,
            updateCheckStatusDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.checkStatusesService.remove(+id);
    }
}
