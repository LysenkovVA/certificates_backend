import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChecksController } from "./checks.controller";
import { ChecksService } from "./checks.service";
import { Check } from "./entities/check.entity";

@Module({
    controllers: [ChecksController],
    providers: [ChecksService],
    imports: [SequelizeModule.forFeature([Check])],
    exports: [ChecksService],
})
export class ChecksModule {}
