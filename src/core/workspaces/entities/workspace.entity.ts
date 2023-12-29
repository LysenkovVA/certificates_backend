import { ApiProperty } from "@nestjs/swagger";
import {
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
import { ConstructionObject } from "../../construction-objects/entities/construction-object.entity";
import { Department } from "../../departments/entities/department.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Organization } from "../../organizations/entities/organization.entity";
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

    @BelongsToMany(() => User, () => UserWorkspaces)
    users: User[];

    @HasMany(() => Inspection, "workspaceId")
    inspections: Inspection[];

    @HasMany(() => Certificate, "workspaceId")
    certificates: Certificate[];

    @HasMany(() => Organization, "workspaceId")
    organizations: Organization[];

    @HasMany(() => ConstructionObject, "workspaceId")
    constructionObjects: ConstructionObject[];

    @HasMany(() => Department, "workspaceId")
    departments: Department[];

    @HasMany(() => Employee, "workspaceId")
    employees: Organization[];

    @HasMany(() => Berth, "workspaceId")
    berthes: Berth[];

    @HasMany(() => BerthType, "workspaceId")
    berthTypes: BerthType[];

    @HasMany(() => CertificateType, "workspaceId")
    certificateTypes: CertificateType[];
}
