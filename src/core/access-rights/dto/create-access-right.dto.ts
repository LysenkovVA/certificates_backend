import { ApiProperty } from "@nestjs/swagger";

export class CreateAccessRightDto {
    @ApiProperty({
        example: "Can read",
        description: "Значение права пользователя",
    })
    readonly value: string;

    @ApiProperty({
        example: "Может читать",
        description: "Описание права пользователя",
    })
    readonly description: string;
}
