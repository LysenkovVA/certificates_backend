import { ApiProperty } from "@nestjs/swagger";

export class CreateBerthDto {
    @ApiProperty({
        example: "Электрик",
        description: "Название должности",
        type: String,
        required: true,
    })
    readonly value: string;
}
