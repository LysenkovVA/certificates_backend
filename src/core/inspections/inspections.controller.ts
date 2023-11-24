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
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { InspectionsService } from "./inspections.service";

@ApiTags("Проверки")
@Controller("inspections")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class InspectionsController {
    constructor(private readonly inspectionsService: InspectionsService) {}

    @Post()
    async create(@Body() createInspectionDto: CreateInspectionDto) {
        return await this.inspectionsService.create(createInspectionDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.inspectionsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.inspectionsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateInspectionDto: UpdateInspectionDto,
    ) {
        return await this.inspectionsService.update(+id, updateInspectionDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.inspectionsService.remove(+id);
    }
}
