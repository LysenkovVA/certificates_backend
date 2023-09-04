import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckListCheckDto {
    @ApiProperty({
        example: "1",
        description: "Позиция проверки в списке",
    })
    readonly position: number;
}
