import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Employee } from "../../employees/entities/employee.entity";
import { File } from "../../files/entities/file.entity";
import { ViolationComment } from "../../violation-comments/entities/violation-comment.entity";
import { ViolationEmployeeComment } from "../../violation-employee-comments/entities/violation-employee-comment.entity";
import { ViolationPhoto } from "../../violation-photos/entities/violation-photos.entity";
import { ViolationViewedBy } from "../../violation_viewed_by/entities/violation_viewed_by.entity";

export interface IInspectionViolationCreationAttrs {}

@Table({
    tableName: "inspection_violations",
})
export class InspectionViolation extends Model<
    InspectionViolation,
    IInspectionViolationCreationAttrs
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
        example: "10.10.2022",
        description: "Срок устранения нарушения",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    readonly termOfElimination: Date;

    @ApiProperty({
        example: "false",
        description: "Устранено или нет",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    readonly isEliminated: boolean;

    @HasMany(() => ViolationComment, "inspectionViolationId")
    violationComments: ViolationComment[];

    @BelongsToMany(() => File, () => ViolationPhoto)
    photos: File[];

    @BelongsToMany(() => Employee, () => ViolationViewedBy)
    viewedBy: Employee[];

    @HasMany(() => ViolationEmployeeComment, "inspectionViolationId")
    employeeComments;
}
