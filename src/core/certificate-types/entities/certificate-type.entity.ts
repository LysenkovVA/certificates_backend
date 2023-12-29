import { ApiProperty } from "@nestjs/swagger";
import {
    BelongsTo,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Certificate } from "../../certificates/entities/certificate.entity";
import { Organization } from "../../organizations/entities/organization.entity";
import { Workspace } from "../../workspaces/entities/workspace.entity";

export interface ICertificateTypeCreationsAttrs {}

@Table({
    tableName: "certificate_types",
})
export class CertificateType extends Model<
    CertificateType,
    ICertificateTypeCreationsAttrs
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
        example: "Охрана труда",
        description: "Название типа удостоверения",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    value: string;

    @ApiProperty({
        example: "true",
        description: "Есть/нет групп(ы)",
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    hasGroups: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isUnlimited: boolean;

    @HasMany(() => Certificate, "certificateTypeId")
    certificates: Certificate[];

    @BelongsTo(() => Workspace, "workspaceId")
    workspace: Workspace;

    @BelongsTo(() => Organization, "organizationId")
    organization: Organization;
}
