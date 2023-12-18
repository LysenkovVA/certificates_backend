import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";

import { User } from "../../users/entity/users.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

@Table({
    tableName: "user_workspaces",
    createdAt: false,
    updatedAt: false,
})
export class UserWorkspaces extends Model<UserWorkspaces> {
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @ForeignKey(() => Workspace)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    workspaceId: number;
}
