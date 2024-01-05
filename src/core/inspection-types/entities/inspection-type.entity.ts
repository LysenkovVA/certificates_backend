import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface IInspectionTypeCreationAttrs {}

@Table({ tableName: "inspection_types" })
export class InspectionType extends Model<
    InspectionType,
    IInspectionTypeCreationAttrs
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
        example: "Плановая",
        description: "Название типа проверки",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @HasMany(() => Inspection, "inspectionTypeId")
    inspections: Inspection[];

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;
}
