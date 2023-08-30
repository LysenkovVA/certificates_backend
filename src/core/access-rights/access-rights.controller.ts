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
import { AccessRightsService } from "./access-rights.service";
import { CreateAccessRightDto } from "./dto/create-access-right.dto";
import { UpdateAccessRightDto } from "./dto/update-access-right.dto";

@Controller("access-rights")
export class AccessRightsController {
    constructor(private readonly accessRightsService: AccessRightsService) {}

    @Post()
    async create(@Body() createAccessRightDto: CreateAccessRightDto) {
        return await this.accessRightsService.create(createAccessRightDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.accessRightsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.accessRightsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateAccessRightDto: UpdateAccessRightDto,
    ) {
        return await this.accessRightsService.update(+id, updateAccessRightDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.accessRightsService.remove(+id);
    }
}
