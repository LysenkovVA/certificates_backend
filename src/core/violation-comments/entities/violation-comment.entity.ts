import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface IViolationCommentCreationAttrs {}

@Table({ tableName: "violation_comments" })
export class ViolationComment extends Model<
    ViolationComment,
    IViolationCommentCreationAttrs
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
        example: "Нарушено условие размещения электрощита",
        description: "Комментарий",
    })
    @Column({
        type: DataType.TEXT,
        unique: true,
        allowNull: false,
    })
    value: string;
}
