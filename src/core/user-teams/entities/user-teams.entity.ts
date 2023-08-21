import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { AccessRight } from "../../access-rights/entities/access-right.entity";
import { Role } from "../../roles/entities/roles.entity";
import { TeamMemberRight } from "../../team-member-rights/entities/team-member-rights";
import { Team } from "../../teams/entities/team.entity";
import { User } from "../../users/entity/users.entity";

export interface IUserTeamCreationAttrs {}

@Table({ tableName: "user_teams" })
export class UserTeam extends Model<UserTeam, IUserTeamCreationAttrs> {
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

    @ApiProperty({
        example: "1",
        description: "Уникальный идентификатор команды",
    })
    @ForeignKey(() => Team)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    teamId: number;

    @BelongsToMany(() => AccessRight, () => TeamMemberRight)
    accessRights: AccessRight[];
}
