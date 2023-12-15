import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { UserRoles } from "../user-roles/entities/user-roles.entity";
import { User } from "../users/entity/users.entity";
import { Role } from "./entities/roles.entity";
import { RolesController } from "./roles.controller";
import { SeedRole } from "./roles.seeder";
import { RolesService } from "./roles.service";

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]),
        SeederModule.forFeature([SeedRole]),
    ],
    exports: [RolesService],
})
export class RolesModule {}
