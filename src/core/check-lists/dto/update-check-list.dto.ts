import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCheckListDto } from "./create-check-list.dto";

export class UpdateCheckListDto extends PartialType(CreateCheckListDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
