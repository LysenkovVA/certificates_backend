import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateInspectionDto } from "./create-inspection.dto";

export class UpdateInspectionDto extends PartialType(CreateInspectionDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
