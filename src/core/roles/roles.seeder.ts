import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "Role",
    unique: ["value"],
})
export class SeedRole implements OnSeederInit {
    run() {
        const data = [
            {
                // Администратор
                value: "ADMIN",
                description: "Роль администратора системы",
            },
            {
                // Пользователь
                value: "USER",
                description: "Роль пользователя",
            },
            {
                value: "ORGANIZATION_ADMIN",
                description: "Роль администратора бизнес-аккаунта",
            },
            {
                value: "ORGANIZATION_MEMBER",
                description: "Роль пользователя бизнес-аккаунта",
            },
        ];
        return data;
    }
}
