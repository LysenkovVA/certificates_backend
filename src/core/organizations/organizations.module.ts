import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Organization } from "./entities/organization.entity";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

@Module({
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
    imports: [SequelizeModule.forFeature([Organization])],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}
