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
import { CheckListGroupsService } from "./check-list-groups.service";
import { CreateCheckListGroupDto } from "./dto/create-check-list-group.dto";
import { UpdateCheckListGroupDto } from "./dto/update-check-list-group.dto";

@ApiTags("Группы пользовательского списка")
@Controller("check-list-groups")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class CheckListGroupsController {
    constructor(
        private readonly checkListGroupsService: CheckListGroupsService,
    ) {}

    @Post()
    async create(@Body() createCheckListGroupDto: CreateCheckListGroupDto) {
        return await this.checkListGroupsService.create(
            createCheckListGroupDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.checkListGroupsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.checkListGroupsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCheckListGroupDto: UpdateCheckListGroupDto,
    ) {
        return await this.checkListGroupsService.update(
            +id,
            updateCheckListGroupDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.checkListGroupsService.remove(+id);
    }
}
