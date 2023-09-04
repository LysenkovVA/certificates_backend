import { ApiProperty } from "@nestjs/swagger";

export class CreateViolationCommentDto {
    @ApiProperty({
        example: "Нарушено условие размещения электрощита",
        description: "Комментарий",
    })
    readonly value: string;
}
