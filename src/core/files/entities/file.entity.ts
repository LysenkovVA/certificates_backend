import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { Protocol } from "../../protocols/entities/protocols.entity";
import { Scan } from "../../scans/entities/scans.entity";

export interface IFileCreationAttrs {}

@Table({ tableName: "files" })
export class File extends Model<File, IFileCreationAttrs> {
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
        example: "111.jpg",
        description: "Имя файла",
        required: true,
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    readonly name: string;

    @ApiProperty({
        example: "user123/certificates/",
        description: "Путь к файлу (статика)",
        required: true,
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    readonly path: string;

    @ApiProperty({
        example: "X-JPG",
        description: "Формат файла",
        required: true,
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    readonly format: string;

    @ApiProperty({
        example: "12347",
        description: "Размер файла в байтах",
        required: true,
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    readonly sizeAtBytes: number;

    @BelongsToMany(() => Certificate, () => Protocol)
    certificatesWhereProtocol: Certificate[];

    @BelongsToMany(() => Certificate, () => Scan)
    certificatesWhereScan: Certificate[];
}
