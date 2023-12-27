import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { BerthType } from "../../berth-types/entities/berth-type.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { Organization } from "../../organizations/entities/organization.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface IBerthCreationAttrs {}

@Table({ tableName: "berthes" })
export class Berth extends Model<Berth, IBerthCreationAttrs> {
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
        example: "Электрик",
        description: "Название должности",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    hasRank: boolean;

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;

    @HasMany(() => Employee, "berthId")
    employees: Employee[];

    @BelongsTo(() => BerthType, "berthTypeId")
    berthType: BerthType;

    @BelongsTo(() => Organization, "organizationId")
    organization: Organization;
}
