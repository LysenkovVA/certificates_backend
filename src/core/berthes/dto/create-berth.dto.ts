import { ApiProperty } from "@nestjs/swagger";

export class CreateBerthDto {
    @ApiProperty({
        example: "Электрик",
        description: "Название должности",
    })
    readonly value: string;
}
