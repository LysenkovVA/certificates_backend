import { ApiProperty } from "@nestjs/swagger";

export class CreateViolationEmployeeCommentDto {
    @ApiProperty({
        example: "Это текст комментария",
        description: "Комментарий",
    })
    readonly value: string;

    @ApiProperty({
        example: "10.01.2022 10:57",
        description: "Дата и время комментария",
    })
    readonly date: Date;
}
