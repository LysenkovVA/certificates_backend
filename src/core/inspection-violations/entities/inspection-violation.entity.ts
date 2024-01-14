import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { File } from "../../files/entities/file.entity";
import { ViolationPhoto } from "../../violation-photos/entities/violation-photos.entity";

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

    @BelongsToMany(() => File, () => ViolationPhoto)
    photos: File[];
}
