import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Check } from "../../checks/entities/check.entity";

export interface ICheckGroupCreationAttrs {}

@Table({
    tableName: "check_groups",
})
export class CheckGroup extends Model<CheckGroup, ICheckGroupCreationAttrs> {
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

    @HasMany(() => Check, "checkGroupId")
    checks: Check[];
}
