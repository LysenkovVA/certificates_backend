import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { OrganizationsModule } from "../organizations/organizations.module";
import { BerthesController } from "./berthes.controller";
import { BerthesService } from "./berthes.service";
import { Berth } from "./entities/berth.entity";

@Module({
    controllers: [BerthesController],
    providers: [BerthesService],
    imports: [SequelizeModule.forFeature([Berth]), OrganizationsModule],
    exports: [BerthesService],
})
export class BerthesModule {}
