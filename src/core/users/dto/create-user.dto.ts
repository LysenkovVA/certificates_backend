import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        example: "example@mail.ru",
        description: "E-mail",
        required: true,
    })
    readonly email: string;

    @ApiProperty({
        example: "123456",
        description: "Пароль",
        required: true,
    })
    readonly password: string;

    @ApiPropertyOptional({
        example: "Иванов",
        description: "Фамилия",
        nullable: true,
    })
    readonly surname: string;

    @ApiPropertyOptional({
        example: "Иван",
        description: "Имя",
        nullable: true,
    })
    readonly name: string;

    @ApiPropertyOptional({
        example: "Иванович",
        description: "Отчество",
        nullable: true,
    })
    readonly patronymic: string;

    @ApiPropertyOptional({
        example: "30.12.2009",
        description: "Дата рождения",
        nullable: true,
    })
    readonly birthDate: Date;

    @ApiPropertyOptional({
        example: "Мой учебный центр",
        description: "Название учебного центра",
        nullable: true,
    })
    readonly studyCenterName: string;

    @ApiPropertyOptional({
        example: "3",
        description: "Идентификатор УЦ",
        nullable: true,
    })
    readonly studyCenterId: number;
}
