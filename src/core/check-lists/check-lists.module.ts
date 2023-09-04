import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CheckListsController } from "./check-lists.controller";
import { CheckListsService } from "./check-lists.service";
import { CheckList } from "./entities/check-list.entity";

@Module({
    controllers: [CheckListsController],
    providers: [CheckListsService],
    imports: [SequelizeModule.forFeature([CheckList])],
    exports: [CheckListsService],
})
export class CheckListsModule {}
