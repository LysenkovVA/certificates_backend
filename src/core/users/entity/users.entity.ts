import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { Role } from "../../roles/entities/roles.entity";
import { Subscription } from "../../subscriptions/entities/subscription.entity";
import { Team } from "../../teams/entities/team.entity";
import { UserRoles } from "../../user-roles/entities/user-roles.entity";
import { UserSubscription } from "../../user-subscriptions/entities/user-subscription.entity";
import { UserTeam } from "../../user-teams/entities/user-teams.entity";

interface IUserCreationAttrs {
    email: string;
    password: string;
}

@Table({
    tableName: "users",
})
export class User extends Model<User, IUserCreationAttrs> {
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
        example: "example@mail.ru",
        description: "E-mail",
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @ApiProperty({
        example: "123456",
        description: "Пароль",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @ApiProperty({
        example: "Иванов",
        description: "Фамилия",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    surname: string;

    @ApiProperty({
        example: "Иван",
        description: "Имя",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name: string;

    @ApiProperty({
        example: "Иванович",
        description: "Отчество",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    patronymic: string;

    @ApiProperty({
        example: "30.06.1993",
        description: "Дата рождения",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    birthDate: Date;

    @ApiProperty({
        example: "unique_name",
        description: "Ссылка на статику аватара",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    avatar: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @BelongsToMany(() => Subscription, () => UserSubscription)
    subscriptions: Subscription[];

    @BelongsToMany(() => Team, () => UserTeam)
    teams: Team[];
}
