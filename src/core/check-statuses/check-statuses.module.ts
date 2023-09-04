import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { SeedCheckStatus } from "./check-statueses.seeder";
import { CheckStatusesController } from "./check-statuses.controller";
import { CheckStatusesService } from "./check-statuses.service";
import { CheckStatus } from "./entities/check-status.entity";

@Module({
    controllers: [CheckStatusesController],
    providers: [CheckStatusesService],
    imports: [
        SequelizeModule.forFeature([CheckStatus]),
        SeederModule.forFeature([SeedCheckStatus]),
    ],
    exports: [CheckStatusesService],
})
export class CheckStatusesModule {}
