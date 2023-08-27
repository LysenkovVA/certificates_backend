import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionDto {
    @ApiProperty({
        example: "Basic",
        description: "Название подписки",
        nullable: false,
    })
    readonly value: string;

    @ApiProperty({
        example: "Базовая подписка",
        description: "Описание",
        nullable: false,
    })
    readonly description: string;

    @ApiProperty({
        example: "0",
        description: "Стоимость за месяц",
        nullable: false,
    })
    readonly pricePerMonth: number;

    @ApiProperty({
        example: "1",
        description: "Количество членов команды",
        nullable: false,
    })
    readonly teamMembersCount: number;

    @ApiProperty({
        example: "1",
        description: "Количество организаций",
        nullable: false,
    })
    readonly organizationsCount: number;
}
