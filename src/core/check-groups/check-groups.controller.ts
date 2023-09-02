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
import { CheckGroupsService } from "./check-groups.service";
import { CreateCheckGroupDto } from "./dto/create-check-group.dto";
import { UpdateCheckGroupDto } from "./dto/update-check-group.dto";

@ApiTags("Группа проверок")
@Controller("check-groups")
export class CheckGroupsController {
    constructor(private readonly checkGroupsService: CheckGroupsService) {}

    @Post()
    async create(@Body() createCheckGroupDto: CreateCheckGroupDto) {
        return await this.checkGroupsService.create(createCheckGroupDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.checkGroupsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.checkGroupsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCheckGroupDto: UpdateCheckGroupDto,
    ) {
        return await this.checkGroupsService.update(+id, updateCheckGroupDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.checkGroupsService.remove(+id);
    }
}
