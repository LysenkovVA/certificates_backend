import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "Subscription",
    unique: ["value"],
})
export class SeedSubscription implements OnSeederInit {
    run() {
        const data = [
            {
                value: "Free",
                description: "Бесплатная подписка для одного пользователя",
                pricePerMonth: 0,
                teamMembersCount: 1,
                organizationsCount: 1,
            },
            {
                value: "Professional",
                description: "Платная подписка для одного пользователя",
                pricePerMonth: 499,
                teamMembersCount: 1,
                organizationsCount: 1,
            },
            {
                value: "Business",
                description: "Подписка для небольшой организации",
                pricePerMonth: 4999,
                teamMembersCount: 5,
                organizationsCount: 1,
            },
            {
                value: "Business PRO",
                description: "Подписка для средней организации",
                pricePerMonth: 9999,
                teamMembersCount: 15,
                organizationsCount: 2,
            },
            {
                value: "Premium",
                description: "Подписка для крупной организации",
                pricePerMonth: 19999,
                teamMembersCount: 30,
                organizationsCount: 5,
            },
            {
                value: "Ultimate",
                description: "Безлимитная подписка",
                pricePerMonth: 29999,
                teamMembersCount: 30,
                organizationsCount: 5,
            },
        ];
        return data;
    }
}
