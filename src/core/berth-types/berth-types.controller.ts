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
import { BerthTypesService } from "./berth-types.service";
import { CreateBerthTypeDto } from "./dto/create-berth-type.dto";
import { UpdateBerthTypeDto } from "./dto/update-berth-type.dto";

@ApiTags("Типы должностей")
@Controller("berth-types")
export class BerthTypesController {
    constructor(private readonly berthTypesService: BerthTypesService) {}

    @Post()
    async create(@Body() createBerthTypeDto: CreateBerthTypeDto) {
        return await this.berthTypesService.create(createBerthTypeDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.berthTypesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.berthTypesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateBerthTypeDto: UpdateBerthTypeDto,
    ) {
        return await this.berthTypesService.update(+id, updateBerthTypeDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.berthTypesService.remove(+id);
    }
}
