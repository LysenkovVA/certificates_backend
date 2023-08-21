import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Organization } from "../../organizations/entities/organization.entity";
import { UserTeam } from "../../user-teams/entities/user-teams.entity";
import { User } from "../../users/entity/users.entity";

export interface ITeamCreationAttrs {}

@Table({
    tableName: "teams",
})
export class Team extends Model<Team, ITeamCreationAttrs> {
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
        example: "Team name",
        description: "Название команды",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "Моя крутая команда",
        description: "Описание команды",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @BelongsToMany(() => User, () => UserTeam)
    users: User[];

    @HasMany(() => Organization, "teamId")
    organizations: Organization[];
}
