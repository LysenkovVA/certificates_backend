import { Global, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Workspace } from "./entities/workspace.entity";
import { WorkspacesController } from "./workspaces.controller";
import { WorkspacesService } from "./workspaces.service";

@Global()
@Module({
    controllers: [WorkspacesController],
    providers: [WorkspacesService],
    imports: [SequelizeModule.forFeature([Workspace])],
    exports: [WorkspacesService],
})
export class WorkspacesModule {}
