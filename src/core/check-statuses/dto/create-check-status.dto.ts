import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckStatusDto {
    @ApiProperty({
        example: "Соответствует",
        description: "Название статуса",
    })
    readonly value: string;
}
