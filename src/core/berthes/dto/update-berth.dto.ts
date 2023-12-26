import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBerthDto } from "./create-berth.dto";

export class UpdateBerthDto extends PartialType(CreateBerthDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
