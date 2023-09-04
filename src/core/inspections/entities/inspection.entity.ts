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
import { InspectionViolation } from "../../inspection-violations/entities/inspection-violation.entity";
import { Inspector } from "../../inspectors/entities/inspectors.entity";
import { RepresentativeEmployee } from "../../representative-employees/entities/representative-employees.entity";

export interface IInspectionCreationAttrs {}

@Table({ tableName: "inspections" })
export class Inspection extends Model<Inspection, IInspectionCreationAttrs> {
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
        example: "10.11.2022",
        description: "Дата проверки",
        required: true,
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    date: Date;

    @ApiProperty({
        example: "true",
        description: "Штрафная или нет",
        required: true,
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isPenalty: boolean;

    @ApiProperty({
        example: "true",
        description: "Комиссионная",
        required: true,
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    readonly isCommitional: boolean;

    @ApiProperty({
        example: "15.11.2022",
        description: "Дата устранения нарушений",
        required: true,
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    readonly dateOfElimination: Date;

    @ApiProperty({
        example: "1234",
        description: "Номер документа",
        required: false,
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    readonly documentNumber: string;

    @ApiProperty({
        example: "10.11.2022",
        description: "Дата документа",
        required: false,
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    readonly documentDate: Date;

    @ApiProperty({
        example: "Проверка выявила много нарушений",
        description: "Комментарии",
        required: false,
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    readonly notes: string;

    @BelongsToMany(() => Employee, () => RepresentativeEmployee)
    representativeEmployees: Employee[];

    @BelongsToMany(() => Employee, () => Inspector)
    inspectors: Employee[];

    @HasMany(() => InspectionViolation, "inspectionId")
    inspectionViolations: InspectionViolation[];
}
