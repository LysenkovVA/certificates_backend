import { ApiProperty } from "@nestjs/swagger";

export class CreateTeamDto {
    @ApiProperty({
        example: "Моя команда",
        description: "Название команды",
        nullable: false,
    })
    readonly value: string;

    @ApiProperty({
        example: "Это моя самая лучшая команда",
        description: "Описание",
        nullable: false,
    })
    readonly description: string;
}
