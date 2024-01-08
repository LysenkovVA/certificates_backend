import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { CheckListGroup } from "../../check-list-groups/entities/check-list-group.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface ICheckListCreationAttrs {}

@Table({
    tableName: "check_lists",
})
export class CheckList extends Model<CheckList, ICheckListCreationAttrs> {
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
        example: "Мой список",
        description: "Название списка",
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    @ApiProperty({
        example: "Это мой главный список",
        description: "Описание",
    })
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;

    @HasMany(() => CheckListGroup, "checkListId")
    checkListGroups: CheckListGroup[];

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;
}
