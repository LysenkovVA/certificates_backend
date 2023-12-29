import { PartialType } from "@nestjs/swagger";
import { CreateCertificateExtendedDto } from "./createCertificateExtended.dto";

export class UpdateCertificateExtendedDto extends PartialType(
    CreateCertificateExtendedDto,
) {}
