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
import { Employee } from "../../employees/entities/employee.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Organization } from "../../organizations/entities/organization.entity";
import { Profile } from "../../profiles/entities/profile.entity";
import { Role } from "../../roles/entities/roles.entity";
import { Subscription } from "../../subscriptions/entities/subscription.entity";
import { Token } from "../../tokens/entities/token.entity";
import { UserRoles } from "../../user-roles/entities/user-roles.entity";
import { UserSubscription } from "../../user-subscriptions/entities/user-subscription.entity";

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

    @HasMany(() => Employee, "userId")
    employees: Employee[];

    @HasMany(() => Inspection, "userId")
    inspections: Inspection[];

    @HasOne(() => Profile, "userId")
    profile: Profile;

    @HasMany(() => Organization, "userId")
    organizations: Organization[];
}
