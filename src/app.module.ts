import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import * as process from "process";
import { AccessRightsModule } from "./core/access-rights/access-rights.module";
import { AccessRight } from "./core/access-rights/entities/access-right.entity";
import { AuthModule } from "./core/auth/auth.module";
import { ConstructionObjectsModule } from "./core/construction-objects/construction-objects.module";
import { ConstructionObject } from "./core/construction-objects/entities/construction-object.entity";
import { DepartmentsModule } from "./core/departments/departments.module";
import { Department } from "./core/departments/entities/department.entity";
import { EmployeesModule } from "./core/employees/employees.module";
import { Employee } from "./core/employees/entities/employee.entity";
import { Organization } from "./core/organizations/entities/organization.entity";
import { OrganizationsModule } from "./core/organizations/organizations.module";
import { Role } from "./core/roles/entities/roles.entity";
import { RolesModule } from "./core/roles/roles.module";
import { Subscription } from "./core/subscriptions/entities/subscription.entity";
import { SubscriptionsModule } from "./core/subscriptions/subscriptions.module";
import { TeamMemberRight } from "./core/team-member-rights/entities/team-member-rights";
import { Team } from "./core/teams/entities/team.entity";
import { TeamsModule } from "./core/teams/teams.module";
import { UserRoles } from "./core/user-roles/entities/user-roles.entity";
import { UserRolesModule } from "./core/user-roles/user-roles.module";
import { UserSubscription } from "./core/user-subscriptions/entities/user-subscription.entity";
import { UserTeam } from "./core/user-teams/entities/user-teams.entity";
import { User } from "./core/users/entity/users.entity";
import { UsersModule } from "./core/users/users.module";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
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
                UserTeam,
                Team,
                TeamMemberRight,
                AccessRight,
                Organization,
                ConstructionObject,
                Department,
                Employee,
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
        TeamsModule,
        AccessRightsModule,
        OrganizationsModule,
        ConstructionObjectsModule,
        DepartmentsModule,
        EmployeesModule,
    ],
})
export class AppModule {}
