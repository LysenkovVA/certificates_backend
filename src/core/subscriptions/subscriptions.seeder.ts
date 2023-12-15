import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { SubscriptionType } from "./types/SubscriptionType";

@Seeder({
    model: "Subscription",
    unique: ["value"],
})
export class SeedSubscription implements OnSeederInit {
    run(): Array<CreateSubscriptionDto> {
        const data = [
            {
                value: SubscriptionType.FREE,
                description: "Бесплатная подписка для одного пользователя",
                pricePerMonth: 0,
                teamMembersCount: 1,
                organizationsCount: 1,
            },
        ];
        return data;
    }
}
