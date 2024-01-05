import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateInspectionTypeDto } from "./create-inspection-type.dto";

export class UpdateInspectionTypeDto extends PartialType(
    CreateInspectionTypeDto,
) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
