import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

@Seeder({
    model: "UserRoles",
    containsForeignKeys: true,
})
export class SeedUserRoles implements OnSeederInit {
    run() {
        const data = [
            {
                userId: 1, // admin@mail.ru
                roleId: 1, // ADMIN
            },
            {
                userId: 2, // user1@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 2, // user1@mail.ru
                roleId: 3, // OHS_ENGINEER
            },
            {
                userId: 3, // user2@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 4, // scowner1@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 4, // scowner1@mail.ru
                roleId: 4, // STUDY_CENTER_OWNER
            },
            {
                userId: 5, // scowner2@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 5, // scowner2@mail.ru
                roleId: 4, // STUDY_CENTER_OWNER
            },
            {
                userId: 6, // manager1@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 6, // manager1@mail.ru
                roleId: 5, // STUDY_CENTER_MANAGER
            },
            {
                userId: 7, // manager2@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 7, // manager2@mail.ru
                roleId: 5, // STUDY_CENTER_MANAGER
            },
            {
                userId: 8, // manager3@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 8, // manager3@mail.ru
                roleId: 5, // STUDY_CENTER_MANAGER
            },
            {
                userId: 9, // manager4@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 9, // manager4@mail.ru
                roleId: 5, // STUDY_CENTER_MANAGER
            },
            {
                userId: 10, // manager5@mail.ru
                roleId: 2, // USER
            },
            {
                userId: 10, // manager5@mail.ru
                roleId: 5, // STUDY_CENTER_MANAGER
            },
        ];
        return data;
    }
}
