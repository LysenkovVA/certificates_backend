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
import { CreateResultDocumentTypeDto } from "./dto/create-result_document_type.dto";
import { UpdateResultDocumentTypeDto } from "./dto/update-result_document_type.dto";
import { ResultDocumentTypesService } from "./result_document_types.service";

@ApiTags("Тип результирующего документа проверки")
@Controller("result-document-types")
export class ResultDocumentTypesController {
    constructor(
        private readonly resultDocumentTypesService: ResultDocumentTypesService,
    ) {}

    @Post()
    async create(
        @Body() createResultDocumentTypeDto: CreateResultDocumentTypeDto,
    ) {
        return await this.resultDocumentTypesService.create(
            createResultDocumentTypeDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return this.resultDocumentTypesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.resultDocumentTypesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateResultDocumentTypeDto: UpdateResultDocumentTypeDto,
    ) {
        return await this.resultDocumentTypesService.update(
            +id,
            updateResultDocumentTypeDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.resultDocumentTypesService.remove(+id);
    }
}
