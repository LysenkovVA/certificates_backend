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
import { ChecksService } from "./checks.service";
import { CreateCheckDto } from "./dto/create-check.dto";
import { UpdateCheckDto } from "./dto/update-check.dto";

@ApiTags("Проверки")
@Controller("checks")
export class ChecksController {
    constructor(private readonly checksService: ChecksService) {}

    @Post()
    async create(@Body() createCheckDto: CreateCheckDto) {
        return await this.checksService.create(createCheckDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.checksService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.checksService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCheckDto: UpdateCheckDto,
    ) {
        return await this.checksService.update(+id, updateCheckDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.checksService.remove(+id);
    }
}
