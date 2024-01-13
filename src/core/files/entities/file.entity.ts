import { InternalServerErrorException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import fs from "fs";
import path from "path";
import {
    BeforeDestroy,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { InspectionViolation } from "../../inspection-violations/entities/inspection-violation.entity";
import { Protocol } from "../../protocols/entities/protocols.entity";
import { Scan } from "../../scans/entities/scans.entity";
import { ViolationPhoto } from "../../violation-photos/entities/violation-photos.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";
import { FILES_PATH } from "../storage/storage";

export interface IFileCreationAttrs {}

@Table({
    tableName: "files",
    // Для срабатывания индивидуальных хуков, нужно включить нужную опцию
    hooks: {
        beforeBulkDestroy: (options) => {
            options.individualHooks = true;
        },
    },
})
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

    @BelongsToMany(() => InspectionViolation, () => ViolationPhoto)
    inspectionViolations: InspectionViolation[];

    @HasMany(() => Employee, "fileId")
    employees: Employee[];

    @HasMany(() => Workspace, "fileId")
    workspace: Workspace;

    /**
     * После удаления записи из БД
     * Необходимо включить индивидуальные хуки в Table-декораторе
     * @param instance
     */
    @BeforeDestroy
    static deleteFileFromStorage(instance: File) {
        // Удаляем старый файл из хранилища файлов
        const filePath = path.resolve(FILES_PATH, instance.path);

        try {
            // Удаляем физический файл синхронно
            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath);
            }
        } catch {
            throw new InternalServerErrorException(
                "Ошибка при удалении физического файла!",
            );
        }
    }
}
