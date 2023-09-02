import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "BerthType",
    unique: ["value"],
})
export class SeedBerthTypes implements OnSeederInit {
    run() {
        const data = [
            {
                value: "ИТР",
            },
            {
                value: "Рабочий",
            },
        ];
        return data;
    }
}
