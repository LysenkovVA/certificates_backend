import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateInspectionTypeDto } from "./dto/create-inspection-type.dto";
import { UpdateInspectionTypeDto } from "./dto/update-inspection-type.dto";
import { InspectionTypesService } from "./inspection-types.service";

@ApiTags("Тип проверки")
@Controller("inspection-types")
export class InspectionTypesController {
    constructor(
        private readonly inspectionTypesService: InspectionTypesService,
    ) {}

    @Post()
    async create(@Body() createInspectionTypeDto: CreateInspectionTypeDto) {
        return await this.inspectionTypesService.create(
            createInspectionTypeDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.inspectionTypesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.inspectionTypesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateInspectionTypeDto: UpdateInspectionTypeDto,
    ) {
        return await this.inspectionTypesService.update(
            +id,
            updateInspectionTypeDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.inspectionTypesService.remove(+id);
    }
}
