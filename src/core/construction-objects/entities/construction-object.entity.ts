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
import { Organization } from "../../organizations/entities/organization.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface IConstructionObjectCreationAttrs {}

@Table({
    tableName: "construction_objects",
})
export class ConstructionObject extends Model<
    ConstructionObject,
    IConstructionObjectCreationAttrs
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
        example: "Площадка № 1",
        description: "Название площадки",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @ApiProperty({
        example: "Ленинский проспект, 23",
        description: "Адрес",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    address: string;

    @ApiProperty({
        example: "01.07.2020",
        description: "Дата начала работ",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    startDate: Date;

    @ApiProperty({
        example: "07.08.2026",
        description: "Дата окончания работ",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    endDate: Date;

    @HasMany(() => Inspection, "constructionObjectId")
    inspections: Inspection[];

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;

    @BelongsTo(() => Organization, "organizationId")
    organization: Organization;
}
