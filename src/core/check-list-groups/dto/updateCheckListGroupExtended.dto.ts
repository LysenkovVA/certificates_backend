import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCheckListGroupExtendedDto } from "./createCheckListGroupExtended.dto";

export class UpdateCheckListGroupExtendedDto extends PartialType(
    CreateCheckListGroupExtendedDto,
) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
