import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { CertificateType } from "../../certificate-types/entities/certificate-type.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { File } from "../../files/entities/file.entity";
import { Protocol } from "../../protocols/entities/protocols.entity";
import { Scan } from "../../scans/entities/scans.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface ICertificateCreationAttrs {}

@Table({
    tableName: "certificates",
})
export class Certificate extends Model<Certificate, ICertificateCreationAttrs> {
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
        example: "Площадка № 1",
        description: "Название площадки",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    number: string;

    @ApiProperty({
        example: "01.07.2020",
        description: "Дата начала действия",
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    startDate: Date;

    @ApiProperty({
        example: "2",
        description: "Группа",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    group: string;

    @BelongsToMany(() => File, () => Protocol)
    protocols: File[];

    @BelongsToMany(() => File, () => Scan)
    scans: File[];

    @BelongsTo(() => Employee, "employeeId")
    employee: Employee;

    @BelongsTo(() => CertificateType, "certificateTypeId")
    certificateType: CertificateType;

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;
}
