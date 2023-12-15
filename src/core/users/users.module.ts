import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { AuthModule } from "../auth/auth.module";
import { Profile } from "../profiles/entities/profile.entity";
import { Role } from "../roles/entities/roles.entity";
import { RolesModule } from "../roles/roles.module";
import { Subscription } from "../subscriptions/entities/subscription.entity";
import { UserRoles } from "../user-roles/entities/user-roles.entity";
import { UserSubscription } from "../user-subscriptions/entities/user-subscription.entity";
import { User } from "./entity/users.entity";
import { UsersController } from "./users.controller";
import { SeedUser } from "./users.seeder";
import { UsersService } from "./users.service";

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
            Profile,
        ]),
        SeederModule.forFeature([SeedUser]),
        RolesModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
