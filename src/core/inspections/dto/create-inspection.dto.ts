import { ApiProperty } from "@nestjs/swagger";

export class CreateInspectionDto {
    @ApiProperty({
        example: "10.11.2022",
        description: "Дата проверки",
        required: true,
    })
    readonly date: Date;

    @ApiProperty({
        example: "true",
        description: "Штрафная или нет",
        required: true,
    })
    readonly isPenalty: boolean;

    @ApiProperty({
        example: "true",
        description: "Комиссионная",
        required: true,
    })
    readonly isCommitional: boolean;

    @ApiProperty({
        example: "15.11.2022",
        description: "Дата устранения нарушений",
        required: true,
    })
    readonly dateOfElimination: Date;

    @ApiProperty({
        example: "1234",
        description: "Номер документа",
        required: false,
    })
    readonly documentNumber: string;

    @ApiProperty({
        example: "10.11.2022",
        description: "Дата документа",
        required: false,
    })
    readonly documentDate: Date;

    @ApiProperty({
        example: "Проверка выявила много нарушений",
        description: "Комментарии",
        required: false,
    })
    readonly notes: string;
}
