import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CheckListGroupsModule } from "../check-list-groups/check-list-groups.module";
import { ChecksModule } from "../checks/checks.module";
import { CheckListsController } from "./check-lists.controller";
import { CheckListsService } from "./check-lists.service";
import { CheckList } from "./entities/check-list.entity";

@Module({
    controllers: [CheckListsController],
    providers: [CheckListsService],
    imports: [
        SequelizeModule.forFeature([CheckList]),
        CheckListGroupsModule,
        ChecksModule,
    ],
    exports: [CheckListsService],
})
export class CheckListsModule {}
