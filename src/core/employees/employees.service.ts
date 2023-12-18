import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Op, Transaction, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { BerthType } from "../berth-types/entities/berth-type.entity";
import { BerthesService } from "../berthes/berthes.service";
import { Berth } from "../berthes/entities/berth.entity";
import { CertificateType } from "../certificate-types/entities/certificate-type.entity";
import { Certificate } from "../certificates/entities/certificate.entity";
import { DepartmentsService } from "../departments/departments.service";
import { Department } from "../departments/entities/department.entity";
import { File } from "../files/entities/file.entity";
import { Organization } from "../organizations/entities/organization.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateEmployeeDto } from "./dto/createEmployee.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Employee) private employeeRepository: typeof Employee,
        private sequelize: Sequelize,
        private berthService: BerthesService,
        private departmentService: DepartmentsService,
        private workspaceService: WorkspacesService,
    ) {
        // Параметры запросов к БД
        this.attributes = [
            "id",
            "surname",
            "name",
            "hireDate",
            "dismissDate",
            "rank",
        ];
        this.include = [
            { model: Workspace },
            {
                model: Berth,
                include: [BerthType],
                attributes: ["id", "value"],
            },
            {
                model: Department,
                include: [{ model: Organization, attributes: ["id", "name"] }],
                attributes: ["id", "name"],
            },
            {
                model: Certificate,
                include: [
                    { model: CertificateType },
                    { model: File, as: "scans" },
                    { model: File, as: "protocols" },
                ],
                attributes: ["id", "number", "startDate", "group"],
            },
            {
                model: File,
            },
        ];
    }

    async create(
        createEmployeeDto: CreateEmployeeDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.employeeRepository.create(createEmployeeDto, {
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createEmployeeDto: CreateEmployeeDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const workspace = await this.workspaceService.findOne(
                workspaceId,
                transaction,
            );

            if (!workspace) {
                throw new InternalServerErrorException(
                    "Рабочее пространство не найдено!",
                );
            }

            const employee = await this.create(createEmployeeDto, transaction);

            await employee.$set("workspace", [workspace.id], {
                transaction,
            });

            // Должность
            if (createEmployeeDto.berth) {
                const berth = await this.berthService.findOne(
                    createEmployeeDto.berth.id,
                    transaction,
                );

                await employee.$set("berth", [berth.id], {
                    transaction,
                });
            }

            // Участок
            if (createEmployeeDto.department) {
                const department = await this.departmentService.findOne(
                    createEmployeeDto.department.id,
                    transaction,
                );

                await employee.$set("department", [department.id], {
                    transaction,
                });
            }

            await transaction.commit();

            return this.findOne(employee.id);
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async update(
        id: number,
        updateEmployeeDto: UpdateEmployeeDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.employeeRepository.update(updateEmployeeDto, {
                    where: { id },
                    transaction,
                });
            }
        } catch (e) {
            throw e;
        }
    }

    async updateExtended(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const employee = await this.findOne(id, transaction);

            if (!employee) {
                throw new BadRequestException("Сотрудник не найден");
            }

            await this.update(id, updateEmployeeDto, transaction);

            // Должность
            if (updateEmployeeDto.berth) {
                const berth = await this.berthService.findOne(
                    updateEmployeeDto.berth.id,
                    transaction,
                );

                await employee.$set("berth", [berth.id], {
                    transaction,
                });
            }

            // Участок
            if (updateEmployeeDto.department) {
                const department = await this.departmentService.findOne(
                    updateEmployeeDto.department.id,
                    transaction,
                );

                await employee.$set("department", [department.id], {
                    transaction,
                });
            }

            await transaction.commit();

            return await this.findOne(id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(
        workspaceId: number,
        limit?: number,
        offset?: number,
        searchQuery?: string,
        transaction?: Transaction,
    ) {
        let where: WhereOptions<Employee> = null;
        if (searchQuery) {
            where = {
                "$workspace.id$": workspaceId,
                [Op.or]: [
                    {
                        surname: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        name: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        } else {
            where = { "$workspace.id$": workspaceId };
        }

        try {
            if (!limit || !offset) {
                return await this.employeeRepository.findAndCountAll({
                    where,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["surname", "ASC"]],
                    distinct: true,
                    transaction,
                });
            } else {
                return await this.employeeRepository.findAndCountAll({
                    limit,
                    offset,
                    where,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["surname", "ASC"]],
                    distinct: true,
                    transaction,
                });
            }
        } catch (e) {
            throw new InternalServerErrorException(e);
        }

        // return await this.employeeRepository.findAndCountAll({
        //     limit,
        //     offset,
        //     transaction,
        //     //subQuery: true, // без этого аттрибута косячил поиск на фронтенде
        //     attributes: this.attributes,
        //     include: this.include,
        //     where,
        //     distinct: true, // Обязательно потому что выдает неверное количество записей при пописке
        //     order: [["surname", "ASC"]],
        // });
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.employeeRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["surname", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Сотрудник не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    // async save(id: string, updateEmployeeDto: CreateEmployeeDto) {
    //     console.log(">>> Start save employee");
    //     const transaction = await this.sequelize.transaction();
    //     console.log("DTO: " + JSON.stringify(updateEmployeeDto));
    //
    //     try {
    //         // const employeeData: EmployeeDto = {
    //         //     surname: updateEmployeeDto.surname,
    //         //     name: updateEmployeeDto.name,
    //         //     hireDate: updateEmployeeDto.hireDate,
    //         //     dismissDate: updateEmployeeDto.dismissDate,
    //         //     email: updateEmployeeDto.email,
    //         //     phone: updateEmployeeDto.phone,
    //         //     rank: updateEmployeeDto.rank,
    //         //     berth: null,
    //         //     department: null
    //         // };
    //
    //         let employee = null;
    //
    //         if (id) {
    //             employee = await this.findOne(+id, transaction);
    //
    //             if (!employee) {
    //                 console.log(">>> Error finding employee");
    //                 throw new BadRequestException(
    //                     "Ошибка при обновлении/создании пользователя",
    //                 );
    //             }
    //
    //             // Обновление информации пользователя
    //             await this.employeeRepository.update(updateEmployeeDto, {
    //                 where: { id },
    //                 transaction,
    //             });
    //         } else {
    //             employee = await this.employeeRepository.create(
    //                 updateEmployeeDto,
    //                 {
    //                     transaction,
    //                 },
    //             );
    //
    //             if (!employee) {
    //                 console.log(">>> Error creating employee");
    //                 throw new BadRequestException(
    //                     "Ошибка при обновлении/создании пользователя",
    //                 );
    //             }
    //         }
    //
    //         // Должность
    //         if (updateEmployeeDto.berth) {
    //             const berth = await this.berthService.findOne(
    //                 updateEmployeeDto.berth.id,
    //                 transaction,
    //             );
    //
    //             await employee.$set("berth", [berth.id], {
    //                 transaction,
    //             });
    //         }
    //
    //         // Участок
    //         if (updateEmployeeDto.department) {
    //             const department = await this.departmentService.findOne(
    //                 updateEmployeeDto.department.id,
    //                 transaction,
    //             );
    //
    //             await employee.$set("department", [department.id], {
    //                 transaction,
    //             });
    //         }
    //
    //         await transaction.commit();
    //
    //         await employee.reload();
    //
    //         return employee;
    //     } catch (error) {
    //         await transaction.rollback();
    //         console.log("Rollback error: " + JSON.stringify(error));
    //         throw error;
    //     }
    // }

    async remove(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Сотрудник не найден");
            }

            return await this.employeeRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
