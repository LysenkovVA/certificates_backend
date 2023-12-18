import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Workspace } from "./entities/workspace.entity";
import { WorkspacesController } from "./workspaces.controller";
import { WorkspacesService } from "./workspaces.service";

@Module({
    controllers: [WorkspacesController],
    providers: [WorkspacesService],
    imports: [SequelizeModule.forFeature([Workspace])],
    exports: [WorkspacesService],
})
export class WorkspacesModule {}
