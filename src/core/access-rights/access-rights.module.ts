import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TeamMemberRight } from "../team-member-rights/entities/team-member-rights";
import { UserTeam } from "../user-teams/entities/user-teams.entity";
import { AccessRightsController } from "./access-rights.controller";
import { AccessRightsService } from "./access-rights.service";
import { AccessRight } from "./entities/access-right.entity";

@Module({
    controllers: [AccessRightsController],
    providers: [AccessRightsService],
    imports: [
        SequelizeModule.forFeature([AccessRight, TeamMemberRight, UserTeam]),
    ],
    exports: [AccessRightsService],
})
export class AccessRightsModule {}
