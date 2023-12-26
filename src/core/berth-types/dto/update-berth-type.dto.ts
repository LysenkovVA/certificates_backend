import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBerthTypeDto } from "./create-berth-type.dto";

export class UpdateBerthTypeDto extends PartialType(CreateBerthTypeDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
