import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "AccessRight",
    unique: ["value"],
})
export class SeedAccessRights implements OnSeederInit {
    run() {
        const data = [
            {
                value: "TEST_ACCESS_RIGHT",
                description: "Тестовое право доступа",
            },
        ];
        return data;
    }
}
