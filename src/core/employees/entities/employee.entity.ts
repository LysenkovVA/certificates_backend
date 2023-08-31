import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

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
}
