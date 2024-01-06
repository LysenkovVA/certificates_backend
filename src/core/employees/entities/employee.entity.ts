import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Berth } from "../../berthes/entities/berth.entity";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { Department } from "../../departments/entities/department.entity";
import { File } from "../../files/entities/file.entity";
import { InspectionViolation } from "../../inspection-violations/entities/inspection-violation.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Inspector } from "../../inspectors/entities/inspectors.entity";
import { RepresentativeEmployee } from "../../representative-employees/entities/representative-employees.entity";
import { ViolationComment } from "../../violation-comments/entities/violation-comment.entity";
import { ViolationEmployeeComment } from "../../violation-employee-comments/entities/violation-employee-comment.entity";
import { ViolationViewedBy } from "../../violation_viewed_by/entities/violation_viewed_by.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface IEmployeeCreationAttrs {}

@Table({
    tableName: "employees",
})
export class Employee extends Model<Employee, IEmployeeCreationAttrs> {
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
        example: "Иванов",
        description: "Фамилия",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    surname: string;

    @ApiProperty({
        example: "Иван",
        description: "Имя",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name: string;

    @ApiProperty({
        example: "01.05.2023",
        description: "Дата приема на работу",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    hireDate: Date;

    @ApiProperty({
        example: "04.07.2023",
        description: "Дата увольнения",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    dismissDate: Date;

    @ApiProperty({
        example: "2",
        description: "Разряд",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    rank: string;

    @ApiProperty({
        example: "+79261234567",
        description: "Телефон",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone: string;

    @ApiProperty({
        example: "email@email.ru",
        description: "E-mail",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    email: string;

    @BelongsToMany(() => Inspection, () => RepresentativeEmployee)
    inspectionsWhereRepresentative: Inspection[];

    @BelongsToMany(() => Inspection, () => Inspector)
    inspectionsWhereInspector: Inspection[];

    @HasMany(() => Certificate, "employeeId")
    certificates: Certificate[];

    @HasMany(() => InspectionViolation, "responsibleForEliminationId")
    inspectionViolationsWhereResponsible: InspectionViolation[];

    @HasMany(() => ViolationComment, "employeeId")
    violationComments: ViolationComment[];

    @BelongsToMany(() => InspectionViolation, () => ViolationViewedBy)
    viewedInspectionViolations: InspectionViolation[];

    @HasMany(() => ViolationEmployeeComment, "employeeId")
    employeeComments: ViolationEmployeeComment[];

    @BelongsTo(() => Berth, "berthId")
    berth: Berth;

    @BelongsTo(() => Department, "departmentId")
    department: Department;

    @BelongsTo(() => File, "fileId")
    avatar: File;

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;
}
