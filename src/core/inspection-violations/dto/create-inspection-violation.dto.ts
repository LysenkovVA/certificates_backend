import { ApiProperty } from "@nestjs/swagger";

export class CreateInspectionViolationDto {
    @ApiProperty({
        example: "10.10.2022",
        description: "Срок устранения нарушения",
    })
    readonly termOfElimination: Date;

    @ApiProperty({
        example: "false",
        description: "Устранено или нет",
    })
    readonly isEliminated: boolean;
}
