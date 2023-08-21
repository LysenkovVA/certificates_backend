import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface IDepartmentCreationAttrs {}

@Table({
    tableName: "departments",
})
export class Department extends Model<Department, IDepartmentCreationAttrs> {
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
        example: "Служба ОТ и ТБ",
        description: "Название подразделения (отдела)",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    name: number;
}
