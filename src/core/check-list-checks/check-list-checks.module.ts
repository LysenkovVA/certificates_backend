import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CheckListChecksController } from "./check-list-checks.controller";
import { CheckListChecksService } from "./check-list-checks.service";
import { CheckListCheck } from "./entities/check-list-check.entity";

@Module({
    controllers: [CheckListChecksController],
    providers: [CheckListChecksService],
    imports: [SequelizeModule.forFeature([CheckListCheck])],
    exports: [CheckListChecksService],
})
export class CheckListChecksModule {}
