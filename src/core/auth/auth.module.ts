import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import * as process from "process";
import { RolesModule } from "../roles/roles.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => RolesModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "PRIVATE_KEY",
            signOptions: {
                expiresIn: "24h",
            },
        }),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
