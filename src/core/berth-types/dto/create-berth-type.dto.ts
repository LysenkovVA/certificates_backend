import { ApiProperty } from "@nestjs/swagger";

export class CreateBerthTypeDto {
    @ApiProperty({
        example: "ИТР",
        description: "Название типа должности",
    })
    readonly value: string;
}
