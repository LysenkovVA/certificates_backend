import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Employee } from "../../employees/entities/employee.entity";

export interface IBerthCreationAttrs {}

@Table({ tableName: "berthes" })
export class Berth extends Model<Berth, IBerthCreationAttrs> {
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
        example: "Электрик",
        description: "Название должности",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @HasMany(() => Employee, "berthId")
    employees: Employee[];
}
