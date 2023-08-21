import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Organization } from "../organizations/entities/organization.entity";
import { ConstructionObjectsController } from "./construction-objects.controller";
import { ConstructionObjectsService } from "./construction-objects.service";
import { ConstructionObject } from "./entities/construction-object.entity";

@Module({
    controllers: [ConstructionObjectsController],
    providers: [ConstructionObjectsService],
    imports: [SequelizeModule.forFeature([ConstructionObject, Organization])],
    exports: [ConstructionObjectsService],
})
export class ConstructionObjectsModule {}
