import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleTypes } from "./types/RoleTypes";

@Seeder({
    model: "Role",
    unique: ["value"],
})
export class SeedRole implements OnSeederInit {
    run() {
        const data: Array<CreateRoleDto> = [
            {
                // Администратор
                value: RoleTypes.ADMIN,
                description: "Администратор",
            },
            {
                // Пользователь
                value: RoleTypes.USER,
                description: "Пользователь",
            },
        ];
        return data;
    }
}
