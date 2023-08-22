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
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { TeamsService } from "./teams.service";

@Controller("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    async create(@Body() createTeamDto: CreateTeamDto) {
        return await this.teamsService.create(createTeamDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: number,
        @Query("offset") offset: number,
    ) {
        return await this.teamsService.findAll(limit, offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.teamsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateTeamDto: UpdateTeamDto,
    ) {
        return await this.teamsService.update(+id, updateTeamDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.teamsService.remove(+id);
    }
}
