import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
    @ApiProperty({
        example: "Иванов",
        description: "Фамилия",
        required: true,
    })
    readonly surname: string;

    @ApiProperty({
        example: "Иван",
        description: "Имя",
        required: true,
    })
    readonly name: string;

    @ApiProperty({
        example: "01.05.2022",
        description: "Дата найма на работу",
        required: false,
    })
    readonly hireDate: Date;

    @ApiProperty({
        example: "01.05.2023",
        description: "Дата увольнения",
        required: false,
    })
    readonly dismissDate: Date;

    @ApiProperty({
        example: "2",
        description: "Разряд",
        required: false,
    })
    readonly rank: string;

    @ApiProperty({
        example: "+79261234567",
        description: "Телефон",
        required: false,
    })
    readonly phone: string;

    @ApiProperty({
        example: "email@email.ru",
        description: "E-mail",
        required: false,
    })
    readonly email: string;
}
