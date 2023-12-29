import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCertificateDto } from "./create-certificate.dto";

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
