import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Inspector } from "../../inspectors/entities/inspectors.entity";
import { RepresentativeEmployee } from "../../representative-employees/entities/representative-employees.entity";

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
        example: "Иванович",
        description: "Отчество",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    patronymic: string;

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

    @BelongsToMany(() => Inspection, () => RepresentativeEmployee)
    inspectionsWhereRepresentative: Inspection[];

    @BelongsToMany(() => Inspection, () => Inspector)
    inspectionsWhereInspector: Inspection[];

    @HasMany(() => Certificate, "employeeId")
    certificates: Certificate[];
}
