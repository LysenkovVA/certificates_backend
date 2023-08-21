import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Organization } from "../organizations/entities/organization.entity";
import { Role } from "../roles/entities/roles.entity";
import { UserTeam } from "../user-teams/entities/user-teams.entity";
import { User } from "../users/entity/users.entity";
import { Team } from "./entities/team.entity";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";

@Module({
    controllers: [TeamsController],
    providers: [TeamsService],
    imports: [
        SequelizeModule.forFeature([Team, UserTeam, User, Role, Organization]),
    ],
    exports: [TeamsService],
})
export class TeamsModule {}
