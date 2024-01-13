import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckDto {
    @ApiProperty({
        example: "Должно соответствовать требованиям ГОСТ",
        description: "Описание",
    })
    readonly description: string;

    @ApiProperty({
        example: "ГОСТ 1234",
        description: "Нормативный документ",
    })
    readonly normativeDocument: string;

    @ApiProperty({
        example: "false",
        description: "Устарело или нет",
    })
    readonly isDeprecated: boolean;

    @ApiProperty({
        example: "1",
        description: "Позиция группы в списке",
    })
    readonly position: number;
}
