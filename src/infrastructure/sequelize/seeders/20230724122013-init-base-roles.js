"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.insert(
                null,
                "roles",
                {
                    value: "ADMIN",
                    description: "Admin",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { transaction },
            );

            await transaction.commit();

            // TODO в отдельном сиде
            // const adminRole = await queryInterface.select(null, "roles", {
            //     where: { value: "ADMIN" },
            // });
            //
            // const adminRoleId = adminRole[0].id;
            //
            // await queryInterface.insert(
            //     null,
            //     "users",
            //     {
            //         email: "admin@mail.ru",
            //         password: "123456",
            //         roles: [adminRoleId],
            //     },
            //     { transaction },
            // );
            //
            // await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            //await queryInterface.removeColumn('Person', 'petName', { transaction });
            await transaction.commit();
        } catch (err) {
            //await transaction.rollback();
            throw err;
        }
    },
};
// module.exports = {
//     async up(queryInterface, Sequelize) {
//         return queryInterface.sequelize.transaction((t) => {
//             return Promise.all([
//                 // Роли пользователей
//                 queryInterface.bulkInsert(
//                     "roles",
//                     [
//                         {
//                             value: "ADMIN",
//                             description: "Admin",
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                         },
//                         {
//                             value: "MANAGER",
//                             description: "Manager of a study center",
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                         },
//                         {
//                             value: "SCOWNER",
//                             description: "Owner of a study center",
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                         },
//                     ],
//                     {
//                         transaction: t,
//                     },
//                 ),
//             ]);
//         });
//     },
//
//     async down(queryInterface, Sequelize) {
//         await queryInterface.bulkDelete("roles", null);
//     },
// };
