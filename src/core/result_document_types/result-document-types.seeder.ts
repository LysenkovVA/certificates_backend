import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "ResultDocumentType",
    unique: ["value"],
})
export class SeedResultDocumentTypes implements OnSeederInit {
    run() {
        const data = [
            {
                value: "Акт проверки",
            },
            {
                value: "Предписание",
            },
        ];
        return data;
    }
}
