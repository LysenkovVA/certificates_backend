import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProfileDto {
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
        example: "30.12.2009",
        description: "Дата рождения",
        nullable: true,
        required: false,
    })
    readonly birthDate: Date;
}
