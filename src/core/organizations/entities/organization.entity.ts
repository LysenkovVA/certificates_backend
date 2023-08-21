import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ConstructionObject } from "../../construction-objects/entities/construction-object.entity";
import { Department } from "../../departments/entities/department.entity";

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
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @HasMany(() => ConstructionObject, "organizationId")
    organizations: ConstructionObject[];

    @HasMany(() => Department, "organizationId")
    departments: Department[];
}
