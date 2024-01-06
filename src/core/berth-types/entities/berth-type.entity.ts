import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Berth } from "../../berthes/entities/berth.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface IBerthTypeCreationAttrs {}

@Table({ tableName: "berth_types" })
export class BerthType extends Model<BerthType, IBerthTypeCreationAttrs> {
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
        example: "ИТР",
        description: "Название типа должности",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;

    @HasMany(() => Berth, "berthTypeId")
    berthes: Berth[];
}
