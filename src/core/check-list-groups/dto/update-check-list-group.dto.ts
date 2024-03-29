import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCheckListGroupDto } from "./create-check-list-group.dto";

export class UpdateCheckListGroupDto extends PartialType(
    CreateCheckListGroupDto,
) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
