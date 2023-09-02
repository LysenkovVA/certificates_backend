import { ApiProperty } from "@nestjs/swagger";

export class CreateInspectionTypeDto {
    @ApiProperty({
        example: "Плановая",
        description: "Описание типа проверки",
    })
    readonly value: string;
}
