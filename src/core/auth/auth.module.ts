import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ProfilesModule } from "../profiles/profiles.module";
import { RolesModule } from "../roles/roles.module";
import { SubscriptionsModule } from "../subscriptions/subscriptions.module";
import { TeamsModule } from "../teams/teams.module";
import { TokensModule } from "../tokens/tokens.module";
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
        TokensModule,
        ProfilesModule,
        JwtModule.register({
            signOptions: {
                expiresIn: "24h",
            },
            global: true,
            secret: "hard!to-guess_secret",
        }),
        // JwtModule.registerAsync({
        //     imports: [ConfigModule],
        //     useFactory: async (configService: ConfigService) => ({
        //         secret: configService.get<string>(""),
        //         secretOrKeyProvider: (
        //             requestType: JwtSecretRequestType,
        //             // tokenOrPayload: string | Object | Buffer,
        //             // verifyOrSignOrOptions?: jwt.VerifyOptions | jwt.SignOptions
        //         ) => {
        //             switch (requestType) {
        //                 case JwtSecretRequestType.SIGN:
        //                     // retrieve signing key dynamically
        //                     return "privateKey";
        //                 case JwtSecretRequestType.VERIFY:
        //                     // retrieve public key for verification dynamically
        //                     return "publicKey";
        //                 default:
        //                     // retrieve secret dynamically
        //                     return "hard!to-guess_secret";
        //             }
        //         },
        //     }),
        //     inject: [ConfigService],
        // }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
