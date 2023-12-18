import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateEmployeeDto } from "./createEmployee.dto";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
