import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { InspectionViolation } from "../../inspection-violations/entities/inspection-violation.entity";

export interface ICheckStatusCreationAttrs {}

@Table({ tableName: "check_statuses" })
export class CheckStatus extends Model<CheckStatus, ICheckStatusCreationAttrs> {
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
        example: "Соответствует",
        description: "Название статуса",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @HasMany(() => InspectionViolation, "checkStatusId")
    inspectionViolations: InspectionViolation[];
}
