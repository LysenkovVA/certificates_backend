import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateDepartmentDto } from "./createDepartment.dto";

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
