import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { UserSubscription } from "../user-subscriptions/entities/user-subscription.entity";
import { User } from "../users/entity/users.entity";
import { Subscription } from "./entities/subscription.entity";
import { SubscriptionsController } from "./subscriptions.controller";
import { SeedSubscription } from "./subscriptions.seeder";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
    imports: [
        SequelizeModule.forFeature([Subscription, User, UserSubscription]),
        SeederModule.forFeature([SeedSubscription]),
    ],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
