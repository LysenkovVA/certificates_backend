import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

import { AuthModule } from "../auth/auth.module";
import { Role } from "../roles/entities/roles.entity";
import { RolesModule } from "../roles/roles.module";
import { Subscription } from "../subscriptions/entities/subscription.entity";
import { UserRoles } from "../user-roles/entities/user-roles.entity";
import { UserSubscription } from "../user-subscriptions/entities/user-subscription.entity";
import { UserTeam } from "../user-teams/entities/user-teams.entity";
import { User } from "./entity/users.entity";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([
            User,
            Role,
            UserRoles,
            Subscription,
            UserSubscription,
            UserTeam,
        ]),
        //SeederModule.forFeature([SeedUser]),
        RolesModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
