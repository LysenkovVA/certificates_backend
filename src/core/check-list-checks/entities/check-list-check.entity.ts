import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface ICheckListCheckCreationAttrs {}

@Table({ tableName: "check_list_checks" })
export class CheckListCheck extends Model<
    CheckListCheck,
    ICheckListCheckCreationAttrs
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
        description: "Позиция проверки в списке",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    position: number;
}
