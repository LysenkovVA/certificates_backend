import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Employee } from "../../employees/entities/employee.entity";

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
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @HasMany(() => Employee, "departmentId")
    employees: Employee[];
}
