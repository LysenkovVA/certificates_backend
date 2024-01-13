import { forwardRef, Global, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "../auth/auth.module";
import { Profile } from "../profiles/entities/profile.entity";
import { Role } from "../roles/entities/roles.entity";
import { RolesModule } from "../roles/roles.module";
import { Subscription } from "../subscriptions/entities/subscription.entity";
import { UserRoles } from "../user-roles/entities/user-roles.entity";
import { UserSubscription } from "../user-subscriptions/entities/user-subscription.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { User } from "./entity/users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Global()
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
            Workspace,
        ]),
        // TODO ИЗ-ЗА СИДА не переключается идентификатор в БД и первый пользователь
        // создается с ошибкой
        // SeederModule.forFeature([SeedUser]),
        RolesModule,
        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
