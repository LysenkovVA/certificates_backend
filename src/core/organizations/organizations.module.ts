import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConstructionObjectsModule } from "../construction-objects/construction-objects.module";
import { DepartmentsModule } from "../departments/departments.module";
import { Organization } from "./entities/organization.entity";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

@Module({
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
    imports: [
        SequelizeModule.forFeature([Organization]),
        DepartmentsModule,
        ConstructionObjectsModule,
    ],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}
