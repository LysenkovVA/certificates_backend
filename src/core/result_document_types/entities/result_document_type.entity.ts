import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Inspection } from "../../inspections/entities/inspection.entity";

export interface IResultDocumentTypeCreationAttrs {}

@Table({
    tableName: "result_document_types",
})
export class ResultDocumentType extends Model<
    ResultDocumentType,
    IResultDocumentTypeCreationAttrs
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
        example: "Предписание",
        description: "Название типа документа",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @HasMany(() => Inspection, "resultDocumentTypeId")
    inspections: Inspection[];
}
