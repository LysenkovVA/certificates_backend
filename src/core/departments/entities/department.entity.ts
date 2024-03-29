import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Employee } from "../../employees/entities/employee.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

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

    @ApiProperty({
        example: "1",
        description: "Позиция в списке (для упорядочивания по важности)",
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    position: number;

    @HasMany(() => Employee, "departmentId")
    employees: Employee[];

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;

    @HasMany(() => Department, "parentDepartmentId")
    departments: Department[];

    @BelongsTo(() => Department, "parentDepartmentId")
    parentDepartment: Department;
}
