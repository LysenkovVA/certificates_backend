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
import { CreateInspectionViolationDto } from "./dto/create-inspection-violation.dto";
import { UpdateInspectionViolationDto } from "./dto/update-inspection-violation.dto";
import { InspectionViolationsService } from "./inspection-violations.service";

@ApiTags("Нарушения проверки")
@Controller("inspection-violations")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class InspectionViolationsController {
    constructor(
        private readonly inspectionViolationsService: InspectionViolationsService,
    ) {}

    @Post()
    async create(
        @Body() createInspectionViolationDto: CreateInspectionViolationDto,
    ) {
        return await this.inspectionViolationsService.create(
            createInspectionViolationDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.inspectionViolationsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.inspectionViolationsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateInspectionViolationDto: UpdateInspectionViolationDto,
    ) {
        return await this.inspectionViolationsService.update(
            +id,
            updateInspectionViolationDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.inspectionViolationsService.remove(+id);
    }
}
