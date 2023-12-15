import * as bcrypt from "bcryptjs";
import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";
import * as process from "process";
import { CreateUserDto } from "./dto/create-user.dto";

@Seeder({
    model: "User",
    unique: ["email"],
    // В проде не создаем
    disabled: process.env.NODE_ENV === "production",
})
export class SeedUser implements OnSeederInit {
    run() {
        const data: Array<CreateUserDto> = [
            {
                email: "admin@mail.ru",
                password: "123456",
            },
        ];
        return data;
    }

    // This function is optional!
    everyone(data: CreateUserDto) {
        // Шифруем пароль для каждого пользователя
        if (data.password) {
            const salt = bcrypt.genSaltSync(5);
            return {
                ...data,
                password: bcrypt.hashSync(data.password, salt),
            };
        }

        return data;
    }
}
