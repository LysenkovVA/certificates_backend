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
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { OrganizationsService } from "./organizations.service";

@ApiTags("Организации")
@Controller("organizations")
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}

    @Post()
    async create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return await this.organizationsService.create(createOrganizationDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.organizationsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.organizationsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateOrganizationDto: UpdateOrganizationDto,
    ) {
        return await this.organizationsService.update(
            +id,
            updateOrganizationDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.organizationsService.remove(+id);
    }
}
