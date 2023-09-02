import { ApiProperty } from "@nestjs/swagger";

export class CreateResultDocumentTypeDto {
    @ApiProperty({
        example: "Предписание",
        description: "Описание типа документа",
    })
    readonly value: string;
}
