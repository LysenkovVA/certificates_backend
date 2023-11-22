import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/entity/users.entity";
import { Profile } from "./entities/profile.entity";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [SequelizeModule.forFeature([User, Profile])],
    exports: [ProfilesService],
})
export class ProfilesModule {}
