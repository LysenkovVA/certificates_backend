import { ApiProperty } from "@nestjs/swagger";

export class CreateDepartmentDto {
    @ApiProperty({
        example: "Мой отдел",
        description: "Название",
    })
    readonly name: string;
}
