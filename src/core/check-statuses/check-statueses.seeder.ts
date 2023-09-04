import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "CheckStatus",
    unique: ["value"],
})
export class SeedCheckStatus implements OnSeederInit {
    run() {
        const data = [
            {
                value: "Соответствует",
            },
            {
                value: "Не соответствует",
            },
            {
                value: "Без оценки",
            },
        ];
        return data;
    }
}
