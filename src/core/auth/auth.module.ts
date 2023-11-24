import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RolesModule } from "../roles/roles.module";
import { SubscriptionsModule } from "../subscriptions/subscriptions.module";
import { TeamsModule } from "../teams/teams.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => RolesModule),
        SubscriptionsModule,
        TeamsModule,
        JwtModule.register({
            signOptions: {
                expiresIn: "24h",
            },
            global: true,
            secret: "hard!to-guess_secret",
        }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
