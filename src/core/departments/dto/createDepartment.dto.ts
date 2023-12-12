import { ApiProperty } from "@nestjs/swagger";

export class CreateDepartmentDto {
    @ApiProperty({
        example: "Мой отдел",
        description: "Название",
        type: String,
        required: true,
    })
    readonly name: string;
}
