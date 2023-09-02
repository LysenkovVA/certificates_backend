import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { File } from "../../files/entities/file.entity";

export interface IProtocolCreationAttrs {}

@Table({ tableName: "protocols" })
export class Protocol extends Model<Protocol, IProtocolCreationAttrs> {
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
        description: "Уникальный идентификатор файла",
    })
    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    fileId: number;

    @ApiProperty({
        example: "1",
        description: "Уникальный идентификатор удостоверения",
    })
    @ForeignKey(() => Certificate)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    certificateId: number;
}
