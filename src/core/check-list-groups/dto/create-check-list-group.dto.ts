import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckListGroupDto {
    @ApiProperty({
        example: "1",
        description: "Позиция группы в списке",
    })
    readonly position: number;
}
