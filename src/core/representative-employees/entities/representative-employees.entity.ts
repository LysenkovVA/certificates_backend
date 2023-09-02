import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Employee } from "../../employees/entities/employee.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";

export interface IRepresentativeEmployeeCreationAttrs {}

@Table({ tableName: "representative_employees" })
export class RepresentativeEmployee extends Model<
    RepresentativeEmployee,
    IRepresentativeEmployeeCreationAttrs
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
        description: "Уникальный идентификатор проверки",
    })
    @ForeignKey(() => Inspection)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    inspectionId: number;

    @ApiProperty({
        example: "1",
        description: "Уникальный идентификатор сотрудника",
    })
    @ForeignKey(() => Employee)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    employeeId: number;
}
