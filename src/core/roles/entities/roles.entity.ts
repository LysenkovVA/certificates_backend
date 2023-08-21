import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { UserRoles } from "../../user-roles/entities/user-roles.entity";
import { UserTeam } from "../../user-teams/entities/user-teams.entity";
import { User } from "../../users/entity/users.entity";

interface IRoleCreationAttrs {
    value: string;
    description: string;
}

@Table({
    tableName: "roles",
    createdAt: false,
    updatedAt: false,
})
export class Role extends Model<Role, IRoleCreationAttrs> {
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
        example: "Admin",
        description: "Уникальное значение роли",
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "Администратор системы",
        description: "Описание роли",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];

    @BelongsToMany(() => Role, () => UserTeam)
    roles: Role[];
}
