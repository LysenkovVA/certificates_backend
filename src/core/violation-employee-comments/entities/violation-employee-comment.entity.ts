import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface IViolationEmployeeCommentCreationAttrs {}

@Table({ tableName: "violation_employee_comments" })
export class ViolationEmployeeComment extends Model<
    ViolationEmployeeComment,
    IViolationEmployeeCommentCreationAttrs
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
        example: "Это текст комментария",
        description: "Комментарий",
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "10.01.2022 10:57",
        description: "Дата и время комментария",
    })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    readonly date: Date;
}
