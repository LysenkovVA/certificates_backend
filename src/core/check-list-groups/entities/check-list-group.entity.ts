import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { CheckList } from "../../check-lists/entities/check-list.entity";
import { Check } from "../../checks/entities/check.entity";

export interface ICheckListGroupCreationAttrs {}

@Table({
    tableName: "check_list_groups",
})
export class CheckListGroup extends Model<
    CheckListGroup,
    ICheckListGroupCreationAttrs
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
        example: "Электробезопасность",
        description: "Название группы",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "1",
        description: "Позиция группы в списке",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    position: number;

    @BelongsTo(() => CheckList, "checkListId")
    checkList: CheckList;

    @HasMany(() => Check, {
        foreignKey: "checkListGroupId",
        onDelete: "CASCADE",
    })
    checks: Check[];
}
