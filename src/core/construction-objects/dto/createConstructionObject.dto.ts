import { ApiProperty } from "@nestjs/swagger";

export class CreateConstructionObjectDto {
    @ApiProperty({
        example: "Площадка № 8",
        description: "Название",
        type: String,
        required: true,
    })
    readonly name: string;

    @ApiProperty({
        example: "Ленинский пр.8",
        description: "Адрес",
        type: String,
        required: false,
    })
    readonly address: string;

    @ApiProperty({
        example: "10.01.23",
        description: "Дата начала работ",
        type: Date,
        required: false,
    })
    readonly startDate: Date;

    @ApiProperty({
        example: "10.12.23",
        description: "Дата окончания работ",
        type: Date,
        required: false,
    })
    readonly endDate: Date;
}
