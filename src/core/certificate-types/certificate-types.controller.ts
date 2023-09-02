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
import { CertificateTypesService } from "./certificate-types.service";
import { CreateCertificateTypeDto } from "./dto/create-certificate-type.dto";
import { UpdateCertificateTypeDto } from "./dto/update-certificate-type.dto";

@ApiTags("Типы удостоверений")
@Controller("certificate_types")
export class CertificateTypesController {
    constructor(
        private readonly certificateTypesService: CertificateTypesService,
    ) {}

    @Post()
    async create(@Body() createCertificateTypeDto: CreateCertificateTypeDto) {
        return await this.certificateTypesService.create(
            createCertificateTypeDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.certificateTypesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.certificateTypesService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCertificateTypeDto: UpdateCertificateTypeDto,
    ) {
        return await this.certificateTypesService.update(
            +id,
            updateCertificateTypeDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.certificateTypesService.remove(+id);
    }
}
