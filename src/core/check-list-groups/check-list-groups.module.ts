import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CheckListGroupsService } from "./check-list-groups.service";
import { CheckListGroup } from "./entities/check-list-group.entity";

@Module({
    // controllers: [CheckListGroupsController],
    providers: [CheckListGroupsService],
    imports: [SequelizeModule.forFeature([CheckListGroup])],
    exports: [CheckListGroupsService],
})
export class CheckListGroupsModule {}
