import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateConstructionObjectDto } from "./createConstructionObject.dto";

export class UpdateConstructionObjectDto extends PartialType(
    CreateConstructionObjectDto,
) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
