import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { OrganizationsModule } from "../organizations/organizations.module";
import { BerthTypesController } from "./berth-types.controller";
import { SeedBerthTypes } from "./berth-types.seeder";
import { BerthTypesService } from "./berth-types.service";
import { BerthType } from "./entities/berth-type.entity";

@Module({
    controllers: [BerthTypesController],
    providers: [BerthTypesService],
    imports: [
        SequelizeModule.forFeature([BerthType]),
        SeederModule.forFeature([SeedBerthTypes]),
        OrganizationsModule,
    ],
    exports: [BerthTypesService],
})
export class BerthTypesModule {}
