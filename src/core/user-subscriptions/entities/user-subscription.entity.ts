import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Subscription } from "../../subscriptions/entities/subscription.entity";
import { User } from "../../users/entity/users.entity";

export interface IUserSubscriptionCreationAttrs {}

@Table({ tableName: "user_subscriptions" })
export class UserSubscription extends Model<
    UserSubscription,
    IUserSubscriptionCreationAttrs
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
        example: "1",
        description: "Уникальный идентификатор пользователя",
    })
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @ApiProperty({
        example: "1",
        description: "Уникальный идентификатор подписки",
    })
    @ForeignKey(() => Subscription)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    subscriptionId: number;

    @ApiProperty({
        example: "10.10.2020",
        description: "Начало подписки",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    startDate: Date;

    @ApiProperty({
        example: "10.10.2024",
        description: "Окончание подписки",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    endDate: Date;
}
