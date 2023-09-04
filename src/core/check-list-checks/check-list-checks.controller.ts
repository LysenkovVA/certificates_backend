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
import { CheckListChecksService } from "./check-list-checks.service";
import { CreateCheckListCheckDto } from "./dto/create-check-list-check.dto";
import { UpdateCheckListCheckDto } from "./dto/update-check-list-check.dto";

@ApiTags("Пункт проверки в пользовательских списках")
@Controller("check-list-checks")
export class CheckListChecksController {
    constructor(
        private readonly checkListChecksService: CheckListChecksService,
    ) {}

    @Post()
    async create(@Body() createCheckListCheckDto: CreateCheckListCheckDto) {
        return await this.checkListChecksService.create(
            createCheckListCheckDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.checkListChecksService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.checkListChecksService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCheckListCheckDto: UpdateCheckListCheckDto,
    ) {
        return await this.checkListChecksService.update(
            +id,
            updateCheckListCheckDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.checkListChecksService.remove(+id);
    }
}
