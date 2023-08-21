import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { UserSubscription } from "../../user-subscriptions/entities/user-subscription.entity";
import { User } from "../../users/entity/users.entity";

interface ISubscriptionCreationAttrs {}

@Table({
    tableName: "subscriptions",
    createdAt: false,
    updatedAt: false,
})
export class Subscription extends Model<
    Subscription,
    ISubscriptionCreationAttrs
> {
    @ApiProperty({
        example: "1",
        description: "Идентификатор",
    })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        example: "Basic",
        description: "Уникальное значение подписки",
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "Базовая подписка",
        description: "Описание",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @ApiProperty({
        example: "4999",
        description: "Сумма",
    })
    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    pricePerMonth: number;

    @ApiProperty({
        example: "1",
        description: "Количество сотрудников в подписке",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    teamMembersCount: number;

    @ApiProperty({
        example: "1",
        description: "Количество организаций в подписке",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    organizationsCount: number;

    @BelongsToMany(() => User, () => UserSubscription)
    users: User[];
}
