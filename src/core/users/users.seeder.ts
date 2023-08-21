import * as bcrypt from "bcryptjs";
import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";
import * as process from "process";

@Seeder({
    model: "User",
    unique: ["email"],
    // В проде не создаем
    disabled: process.env.NODE_ENV === "production",
})
export class SeedUser implements OnSeederInit {
    run() {
        const data = [
            {
                email: "admin@mail.ru",
                password: "123456",
            },
            {
                email: "user1@mail.ru",
                password: "123456",
            },
            {
                email: "user2@mail.ru",
                password: "123456",
            },
            {
                email: "scowner1@mail.ru",
                password: "123456",
            },
            {
                email: "scowner2@mail.ru",
                password: "123456",
            },
            {
                email: "manager1@mail.ru",
                password: "123456",
            },
            {
                email: "manager2@mail.ru",
                password: "123456",
            },
            {
                email: "manager3@mail.ru",
                password: "123456",
            },
            {
                email: "manager4@mail.ru",
                password: "123456",
            },
            {
                email: "manager5@mail.ru",
                password: "123456",
            },
        ];
        return data;
    }

    // This function is optional!
    everyone(data) {
        // Шифруем пароль для каждого пользователя
        if (data.password) {
            const salt = bcrypt.genSaltSync(5);
            data.password = bcrypt.hashSync(data.password, salt);
        }

        // Aggregated timestamps
        // data.created_at = new Date().toISOString();
        // data.updated_at = new Date().toISOString();

        return data;
    }
}
