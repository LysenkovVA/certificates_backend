import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { BerthType } from "../../berth-types/entities/berth-type.entity";
import { Berth } from "../../berthes/entities/berth.entity";
import { CertificateType } from "../../certificate-types/entities/certificate-type.entity";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { CheckList } from "../../check-lists/entities/check-list.entity";
import { ConstructionObject } from "../../construction-objects/entities/construction-object.entity";
import { Department } from "../../departments/entities/department.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { File } from "../../files/entities/file.entity";
import { InspectionType } from "../../inspection-types/entities/inspection-type.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { UserWorkspaces } from "../../user-workspaces/entities/user-workspaces.entity";
import { User } from "../../users/entity/users.entity";

interface IWorkspaceCreationAttrs {
    email: string;
    password: string;
}

@Table({
    tableName: "workspaces",
})
export class Workspace extends Model<Workspace, IWorkspaceCreationAttrs> {
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
        example: "Мое рабочее пространство",
        description: "Название",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @ApiProperty({
        example:
            "Общество с ограниченной ответственностью «СпецСтройТехнологии-М»",
        description: "Название организации",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationName: string;

    @ApiProperty({
        example:
            "Россия, 117556, г. Москва, Варшавское шоссе, д.79 к.2 эт.5, пом.8, ком.1 (часть)",
        description: "Адрес организации",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationAddress: string;

    @ApiProperty({
        example: "+7 (495) 252 10 07",
        description: "Телефон организации",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationPhone: string;

    @ApiProperty({
        example: "info@sst-m.ru",
        description: "Email организации",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationEmail: string;

    @ApiProperty({
        example: "sst-m.ru",
        description: "Сайт организации",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationWeb: string;

    @ApiProperty({
        example: "7709457618",
        description: "Индивидуальный налоговый номер (ИНН)",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationINN: string;

    @ApiProperty({
        example: "772601001",
        description: "Код причины постановки клиента на учет (КПП)",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationKPP: string;

    @ApiProperty({
        example: "Филиал «Центральный» Банка ВТБ (ПАО) в г. Москве",
        description: "Банк",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationBank: string;

    @ApiProperty({
        example: "40702810400000112332",
        description: "Расчетный счет",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationRS: string;

    @ApiProperty({
        example: "30101810145250000411",
        description: "Корреспондентский счет (к/с)",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationKS: string;

    @ApiProperty({
        example: "044525411",
        description: "Банковский идентификационный код (БИК)",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationBIK: string;

    @ApiProperty({
        example: "45126448",
        description: "ОКПО",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationOKPO: string;

    @ApiProperty({
        example: "41.20",
        description: "ОКВЭД",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationOKVED: string;

    @ApiProperty({
        example: "1157746433558",
        description: "ОГРН",
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    organizationOGRN: string;

    @BelongsTo(() => File, "fileId")
    organizationLogo: File;

    @BelongsToMany(() => User, () => UserWorkspaces)
    users: Array<User>;

    @HasMany(() => Inspection, "workspaceId")
    inspections: Array<Inspection>;

    @HasMany(() => Certificate, "workspaceId")
    certificates: Array<Certificate>;

    @HasMany(() => ConstructionObject, "workspaceId")
    constructionObjects: Array<ConstructionObject>;

    @HasMany(() => Department, "workspaceId")
    departments: Array<Department>;

    @HasMany(() => Employee, "workspaceId")
    employees: Array<Employee>;

    @HasMany(() => Berth, "workspaceId")
    berthes: Array<Berth>;

    @HasMany(() => BerthType, "workspaceId")
    berthTypes: Array<BerthType>;

    @HasMany(() => CertificateType, "workspaceId")
    certificateTypes: Array<CertificateType>;

    @HasMany(() => InspectionType, "workspaceId")
    inspectionTypes: Array<InspectionType>;

    @HasMany(() => CheckList, "workspaceId")
    checkLists: Array<CheckList>;
}
