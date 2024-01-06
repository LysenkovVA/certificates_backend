import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateWorkspaceDto } from "./create-workspace.dto";

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
