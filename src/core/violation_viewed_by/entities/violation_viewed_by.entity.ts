import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Employee } from "../../employees/entities/employee.entity";
import { InspectionViolation } from "../../inspection-violations/entities/inspection-violation.entity";

export interface IViolationViewedByCreationAttrs {}

@Table({ tableName: "violation_viewed_by" })
export class ViolationViewedBy extends Model<
    ViolationViewedBy,
    IViolationViewedByCreationAttrs
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
        description: "Уникальный идентификатор нарушения",
    })
    @ForeignKey(() => InspectionViolation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    inspectionViolationId: number;

    @ApiProperty({
        example: "1",
        description: "Уникальный идентификатор файла",
    })
    @ForeignKey(() => Employee)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    employeeId: number;
}
