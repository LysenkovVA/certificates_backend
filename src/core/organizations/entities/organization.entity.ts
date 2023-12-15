import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { ConstructionObject } from "../../construction-objects/entities/construction-object.entity";
import { Department } from "../../departments/entities/department.entity";
import { User } from "../../users/entity/users.entity";

export interface IOrganizationCreationAttrs {}

@Table({
    tableName: "organizations",
})
export class Organization extends Model<
    Organization,
    IOrganizationCreationAttrs
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
        example: "Рога и копыта",
        description: "Название организации",
        type: String,
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @ApiProperty({
        example: [],
        description: "Участки",
        type: [Department],
    })
    @HasMany(() => Department, "organizationId")
    departments: Department[];

    @ApiProperty({
        example: [],
        description: "Объекты",
        type: [ConstructionObject],
    })
    @HasMany(() => ConstructionObject, "organizationId")
    constructionObjects: ConstructionObject[];

    @BelongsTo(() => User, "userId")
    user: User;
}
