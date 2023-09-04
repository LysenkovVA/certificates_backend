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
import { CheckListsService } from "./check-lists.service";
import { CreateCheckListDto } from "./dto/create-check-list.dto";
import { UpdateCheckListDto } from "./dto/update-check-list.dto";

@Controller("check-lists")
export class CheckListsController {
    constructor(private readonly checkListsService: CheckListsService) {}

    @Post()
    async create(@Body() createCheckListDto: CreateCheckListDto) {
        return await this.checkListsService.create(createCheckListDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.checkListsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.checkListsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCheckListDto: UpdateCheckListDto,
    ) {
        return await this.checkListsService.update(+id, updateCheckListDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.checkListsService.remove(+id);
    }
}
