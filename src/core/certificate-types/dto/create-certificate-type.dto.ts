import { ApiProperty } from "@nestjs/swagger";

export class CreateCertificateTypeDto {
    @ApiProperty({
        example: "Охрана труда",
        description: "Название типа",
        required: true,
    })
    readonly value: string;

    @ApiProperty({
        example: "true",
        description: "Есть/нет групп(ы)",
        required: true,
        default: false,
    })
    readonly hasGroups: boolean;

    @ApiProperty({
        example: "true",
        description: "Бессрочное",
        required: true,
        default: false,
    })
    readonly isUnlimited: boolean;
}
