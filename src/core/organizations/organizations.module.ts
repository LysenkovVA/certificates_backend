import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { Organization } from "./entities/organization.entity";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

@Module({
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
    imports: [SequelizeModule.forFeature([Organization]), JwtModule],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}
