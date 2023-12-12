import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationDto {
    @ApiProperty({
        example: "Рога и копыта",
        description: "Название организации",
        type: String,
        required: true,
    })
    readonly name: string;
}
