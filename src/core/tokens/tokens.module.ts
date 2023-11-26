import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/entity/users.entity";
import { Token } from "./entities/token.entity";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";

@Module({
    controllers: [TokensController],
    providers: [TokensService],
    imports: [SequelizeModule.forFeature([Token, User])],
    exports: [TokensService],
})
export class TokensModule {}
