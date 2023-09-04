import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckListDto {
    @ApiProperty({
        example: "Мой список",
        description: "Название списка",
    })
    readonly name: string;

    @ApiProperty({
        example: "Это мой главный список",
        description: "Описание",
    })
    readonly description: string;
}
