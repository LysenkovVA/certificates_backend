import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        example: "example@mail.ru",
        description: "E-mail",
        type: [String],
        required: true,
    })
    readonly email: string;

    @ApiProperty({
        example: "123456",
        description: "Пароль",
        type: [String],
        required: true,
    })
    readonly password: string;
}
