import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConstructionObjectsController } from "./construction-objects.controller";
import { ConstructionObjectsService } from "./construction-objects.service";
import { ConstructionObject } from "./entities/construction-object.entity";

@Module({
    controllers: [ConstructionObjectsController],
    providers: [ConstructionObjectsService],
    imports: [SequelizeModule.forFeature([ConstructionObject])],
    exports: [ConstructionObjectsService],
})
export class ConstructionObjectsModule {}
