import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateOrganizationDto } from "./createOrganization.dto";

// Все поля из PartialType опциональные!
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
        type: Number,
        required: false,
    })
    readonly id: number;
}
