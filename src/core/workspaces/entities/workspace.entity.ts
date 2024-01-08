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
import { CheckList } from "../../check-lists/entities/check-list.entity";
import { ConstructionObject } from "../../construction-objects/entities/construction-object.entity";
import { Department } from "../../departments/entities/department.entity";
import { Employee } from "../../employees/entities/employee.entity";
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
