import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateCertificateTypeDto } from "../../certificate-types/dto/update-certificate-type.dto";
import { CreateCertificateDto } from "./create-certificate.dto";

export class CreateCertificateExtendedDto extends IntersectionType(
    CreateCertificateDto,
) {
    @Type(() => UpdateCertificateTypeDto)
    @ApiProperty({ required: false })
    readonly certificateType: UpdateCertificateTypeDto;
}
