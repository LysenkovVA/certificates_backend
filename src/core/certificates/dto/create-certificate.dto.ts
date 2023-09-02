import { ApiProperty } from "@nestjs/swagger";

export class CreateCertificateDto {
    @ApiProperty({
        example: "12345",
        description: "Номер",
        required: true,
    })
    readonly number: string;

    @ApiProperty({
        example: "10.01.23",
        description: "Дата начала действия",
        required: true,
    })
    readonly startDate: Date;

    @ApiProperty({
        example: "2",
        description: "Группа",
        required: false,
    })
    readonly group: string;
}
