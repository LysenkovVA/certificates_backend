import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";

import { Role } from "../../roles/entities/roles.entity";
import { User } from "../../users/entity/users.entity";

@Table({
    tableName: "user_roles",
    createdAt: false,
    updatedAt: false,
})
export class UserRoles extends Model<UserRoles> {
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
        description: "Уникальный идентификатор роли",
    })
    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    roleId: number;
}
