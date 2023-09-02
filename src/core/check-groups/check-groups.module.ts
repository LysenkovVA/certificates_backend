import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CheckGroupsController } from "./check-groups.controller";
import { CheckGroupsService } from "./check-groups.service";
import { CheckGroup } from "./entities/check-group.entity";

@Module({
    controllers: [CheckGroupsController],
    providers: [CheckGroupsService],
    imports: [SequelizeModule.forFeature([CheckGroup])],
    exports: [CheckGroupsService],
})
export class CheckGroupsModule {}
