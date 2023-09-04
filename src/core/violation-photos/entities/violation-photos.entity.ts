import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { File } from "../../files/entities/file.entity";
import { InspectionViolation } from "../../inspection-violations/entities/inspection-violation.entity";

export interface IViolationPhotoCreationAttrs {}

@Table({ tableName: "violation_photos" })
export class ViolationPhoto extends Model<
    ViolationPhoto,
    IViolationPhotoCreationAttrs
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
    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    fileId: number;
}
