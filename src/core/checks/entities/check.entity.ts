import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { CheckListGroup } from "../../check-list-groups/entities/check-list-group.entity";

export interface ICheckCreationAttrs {}

@Table({
    tableName: "checks",
})
export class Check extends Model<Check, ICheckCreationAttrs> {
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
        example: "Должно соответствовать требованиям ГОСТ",
        description: "Описание",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    readonly description: string;

    @ApiProperty({
        example: "ГОСТ 1234",
        description: "Нормативный документ",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    readonly normativeDocument: string;

    @ApiProperty({
        example: "false",
        description: "Устарело или нет",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    readonly isDeprecated: boolean;

    @ApiProperty({
        example: "1",
        description: "Позиция группы в списке",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    position: number;

    @BelongsTo(() => CheckListGroup, "checkListGroupId")
    checkListGroup: CheckListGroup;
}
