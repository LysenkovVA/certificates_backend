import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCertificateTypeDto } from "./create-certificate-type.dto";

export class UpdateCertificateTypeDto extends PartialType(
    CreateCertificateTypeDto,
) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
