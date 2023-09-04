import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { CheckListCheck } from "../../check-list-checks/entities/check-list-check.entity";

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
        example: "1",
        description: "Позиция группы в списке",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    position: number;

    @HasMany(() => CheckListCheck, "checkListGroupId")
    checkListChecks: CheckListCheck[];
}
