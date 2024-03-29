import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import * as process from "process";
import { AuthModule } from "./core/auth/auth.module";
import { BerthTypesModule } from "./core/berth-types/berth-types.module";
import { BerthType } from "./core/berth-types/entities/berth-type.entity";
import { BerthesModule } from "./core/berthes/berthes.module";
import { Berth } from "./core/berthes/entities/berth.entity";
import { CertificateTypesModule } from "./core/certificate-types/certificate-types.module";
import { CertificateType } from "./core/certificate-types/entities/certificate-type.entity";
import { CertificatesModule } from "./core/certificates/certificates.module";
import { Certificate } from "./core/certificates/entities/certificate.entity";
import { CheckListGroupsModule } from "./core/check-list-groups/check-list-groups.module";
import { CheckListGroup } from "./core/check-list-groups/entities/check-list-group.entity";
import { CheckListsModule } from "./core/check-lists/check-lists.module";
import { CheckList } from "./core/check-lists/entities/check-list.entity";
import { CheckStatusesModule } from "./core/check-statuses/check-statuses.module";
import { CheckStatus } from "./core/check-statuses/entities/check-status.entity";
import { ChecksModule } from "./core/checks/checks.module";
import { Check } from "./core/checks/entities/check.entity";
import { ConstructionObjectsModule } from "./core/construction-objects/construction-objects.module";
import { ConstructionObject } from "./core/construction-objects/entities/construction-object.entity";
import { DepartmentsModule } from "./core/departments/departments.module";
import { Department } from "./core/departments/entities/department.entity";
import { EmployeesModule } from "./core/employees/employees.module";
import { Employee } from "./core/employees/entities/employee.entity";
import { File } from "./core/files/entities/file.entity";
import { FilesModule } from "./core/files/files.module";
import { InspectionType } from "./core/inspection-types/entities/inspection-type.entity";
import { InspectionTypesModule } from "./core/inspection-types/inspection-types.module";
import { InspectionViolation } from "./core/inspection-violations/entities/inspection-violation.entity";
import { InspectionViolationsModule } from "./core/inspection-violations/inspection-violations.module";
import { Inspection } from "./core/inspections/entities/inspection.entity";
import { InspectionsModule } from "./core/inspections/inspections.module";
import { Inspector } from "./core/inspectors/entities/inspectors.entity";
import { Profile } from "./core/profiles/entities/profile.entity";
import { ProfilesModule } from "./core/profiles/profiles.module";
import { Protocol } from "./core/protocols/entities/protocols.entity";
import { RepresentativeEmployee } from "./core/representative-employees/entities/representative-employees.entity";
import { ResultDocumentType } from "./core/result_document_types/entities/result_document_type.entity";
import { ResultDocumentTypesModule } from "./core/result_document_types/result_document_types.module";
import { Role } from "./core/roles/entities/roles.entity";
import { RolesModule } from "./core/roles/roles.module";
import { Scan } from "./core/scans/entities/scans.entity";
import { Subscription } from "./core/subscriptions/entities/subscription.entity";
import { SubscriptionsModule } from "./core/subscriptions/subscriptions.module";
import { Token } from "./core/tokens/entities/token.entity";
import { TokensModule } from "./core/tokens/tokens.module";
import { UserRoles } from "./core/user-roles/entities/user-roles.entity";
import { UserRolesModule } from "./core/user-roles/user-roles.module";
import { UserSubscription } from "./core/user-subscriptions/entities/user-subscription.entity";
import { UserWorkspaces } from "./core/user-workspaces/entities/user-workspaces.entity";
import { User } from "./core/users/entity/users.entity";
import { UsersModule } from "./core/users/users.module";
import { ViolationPhoto } from "./core/violation-photos/entities/violation-photos.entity";
import { Workspace } from "./core/workspaces/entities/workspace.entity";
import { WorkspacesModule } from "./core/workspaces/workspaces.module";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
            cache: true,
            isGlobal: true,
        }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true,
            synchronize: true,
            // logging: false,
            // logQueryParameters: false,
            // Чтобы изменения подхватывались при изменении моделей
            sync: {
                alter: true,
            },
            // ПЕРЕЧИСЛЕНИЕ ВСЕХ МОДЕЛЕЙ
            models: [
                User,
                Role,
                UserRoles,
                Subscription,
                UserSubscription,
                ConstructionObject,
                Department,
                Employee,
                Berth,
                BerthType,
                Inspection,
                InspectionType,
                ResultDocumentType,
                RepresentativeEmployee,
                Inspector,
                Certificate,
                CertificateType,
                File,
                Protocol,
                Scan,
                Check,
                InspectionViolation,
                CheckStatus,
                ViolationPhoto,
                CheckList,
                CheckListGroup,
                Profile,
                Token,
                Workspace,
                UserWorkspaces,
            ],
            define: {
                createdAt: false,
                updatedAt: false,
            },
        }),
        // Модуль для заполнения БД
        SeederModule.forRoot({
            isGlobal: true,
            logging: true,
            disabled: false,
            runOnlyIfTableIsEmpty: true,
            connection: "default",
            autoIdFieldName: "id",
            disableEveryOne: false,
            enableAutoId: true,
            foreignDelay: 4000, // 2 seconds
        }),
        UsersModule,
        RolesModule,
        UserRolesModule,
        AuthModule,
        SubscriptionsModule,
        ConstructionObjectsModule,
        DepartmentsModule,
        EmployeesModule,
        BerthesModule,
        BerthTypesModule,
        InspectionsModule,
        InspectionTypesModule,
        ResultDocumentTypesModule,
        CertificatesModule,
        CertificateTypesModule,
        FilesModule,
        ChecksModule,
        InspectionViolationsModule,
        CheckStatusesModule,
        CheckListsModule,
        CheckListGroupsModule,
        ProfilesModule,
        TokensModule,
        WorkspacesModule,
    ],
})
export class AppModule {}
