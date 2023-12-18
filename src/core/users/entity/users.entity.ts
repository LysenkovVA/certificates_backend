import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    HasOne,
    Model,
    Table,
} from "sequelize-typescript";
import { Profile } from "../../profiles/entities/profile.entity";
import { Role } from "../../roles/entities/roles.entity";
import { Subscription } from "../../subscriptions/entities/subscription.entity";
import { Token } from "../../tokens/entities/token.entity";
import { UserRoles } from "../../user-roles/entities/user-roles.entity";
import { UserSubscription } from "../../user-subscriptions/entities/user-subscription.entity";
import { UserWorkspaces } from "../../user-workspaces/entities/user-workspaces.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

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

    @HasMany(() => Token, "userId")
    tokens: Token[];

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @BelongsToMany(() => Subscription, () => UserSubscription)
    subscriptions: Subscription[];

    @HasOne(() => Profile, "userId")
    profile: Profile;

    @BelongsToMany(() => Workspace, () => UserWorkspaces)
    workspaces: Workspace[];
}
