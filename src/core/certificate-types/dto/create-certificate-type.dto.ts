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
    })
    readonly hasGroups: boolean;
}
