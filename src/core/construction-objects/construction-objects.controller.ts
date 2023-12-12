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
import { ConstructionObjectsService } from "./construction-objects.service";
import { CreateConstructionObjectDto } from "./dto/createConstructionObject.dto";
import { UpdateConstructionObjectDto } from "./dto/updateConstructionObject.dto";

@ApiTags("Строительные объекты")
@Controller("construction-objects")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class ConstructionObjectsController {
    constructor(
        private readonly constructionObjectsService: ConstructionObjectsService,
    ) {}

    @Post()
    async create(
        @Body() createConstructionObjectDto: CreateConstructionObjectDto,
    ) {
        return await this.constructionObjectsService.create(
            createConstructionObjectDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.constructionObjectsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.constructionObjectsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateConstructionObjectDto: UpdateConstructionObjectDto,
    ) {
        return await this.constructionObjectsService.update(
            +id,
            updateConstructionObjectDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.constructionObjectsService.remove(+id);
    }
}
