import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "InspectionType",
    unique: ["value"],
})
export class SeedInspectionTypes implements OnSeederInit {
    run() {
        const data = [
            {
                value: "Плановая",
            },
            {
                value: "Внеплановая",
            },
        ];
        return data;
    }
}
