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
import { CertificatesService } from "./certificates.service";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";

@ApiTags("Удостоверения")
@Controller("certificates")
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) {}

    @Post()
    async create(@Body() createCertificateDto: CreateCertificateDto) {
        return await this.certificatesService.create(createCertificateDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.certificatesService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.certificatesService.findOne(+id);
    }

    @Get("/employee/:employeeId")
    async fetchByEmployeeId(@Param("employeeId") employeeId: string) {
        return await this.certificatesService.fetchByEmployeeId(+employeeId);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateCertificateDto: UpdateCertificateDto,
    ) {
        return await this.certificatesService.update(+id, updateCertificateDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.certificatesService.remove(+id);
    }
}
