import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { TeamMemberRight } from "../../team-member-rights/entities/team-member-rights";
import { UserTeam } from "../../user-teams/entities/user-teams.entity";

export interface IAccessRightCreationAttrs {}

@Table({
    tableName: "access_rights",
})
export class AccessRight extends Model<AccessRight, IAccessRightCreationAttrs> {
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
        example: "Просмотр удостоверений",
        description: "Название разрешения",
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "Разрешение на просмотр удостоверений",
        description: "Описание разрешения",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @BelongsToMany(() => UserTeam, () => TeamMemberRight)
    userTeams: UserTeam[];
}
