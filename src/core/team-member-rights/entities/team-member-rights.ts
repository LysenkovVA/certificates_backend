import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { AccessRight } from "../../access-rights/entities/access-right.entity";
import { UserTeam } from "../../user-teams/entities/user-teams.entity";

export interface ITeamMemberRightsCreationAttrs {}

@Table({
    tableName: "team_member_rights",
})
export class TeamMemberRight extends Model<
    TeamMemberRight,
    ITeamMemberRightsCreationAttrs
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
        description: "Идентификатор команды пользователя",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => UserTeam)
    userTeamId: number;

    @ApiProperty({
        example: "1",
        description: "Идентификатор права доступа",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => AccessRight)
    accessRightId: number;

    @ApiProperty({
        example: "true",
        description: "Создание записи",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    canCreate: boolean;

    @ApiProperty({
        example: "true",
        description: "Чтение записи",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    canRead: boolean;

    @ApiProperty({
        example: "true",
        description: "Изменение записи",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    canUpdate: boolean;

    @ApiProperty({
        example: "true",
        description: "Удаление записи",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    canDelete: boolean;
}
