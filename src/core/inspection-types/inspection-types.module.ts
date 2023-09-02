import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { InspectionType } from "./entities/inspection-type.entity";
import { InspectionTypesController } from "./inspection-types.controller";
import { SeedInspectionTypes } from "./inspection-types.seeder";
import { InspectionTypesService } from "./inspection-types.service";

@Module({
    controllers: [InspectionTypesController],
    providers: [InspectionTypesService],
    imports: [
        SequelizeModule.forFeature([InspectionType]),
        SeederModule.forFeature([SeedInspectionTypes]),
    ],
    exports: [InspectionTypesService],
})
export class InspectionTypesModule {}
