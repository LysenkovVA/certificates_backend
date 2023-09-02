import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckGroupDto {
    @ApiProperty({
        example: "Электробезопасность",
        description: "Название группы",
    })
    readonly value: string;
}
