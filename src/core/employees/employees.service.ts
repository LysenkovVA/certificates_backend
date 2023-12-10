import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as console from "console";
import { Op, Transaction, WhereOptions } from "sequelize";
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
import { EmployeeDto } from "./dto/employee.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
    constructor(
        @InjectModel(Employee) private employeeRepository: typeof Employee,
        private sequelize: Sequelize,
        private berthService: BerthesService,
        private departmentService: DepartmentsService,
    ) {}

    private async create(
        createEmployeeDto: EmployeeDto,
        transaction?: Transaction,
    ) {
        console.log(">>> Create employee");
        return await this.employeeRepository.create(createEmployeeDto, {
            transaction,
        });
    }

    async findAll(
        limit: number,
        offset: number,
        searchQuery?: string,
        transaction?: Transaction,
    ) {
        let where: WhereOptions<Employee> = null;

        if (searchQuery) {
            where = {
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
                    // {
                    //     "$berth.value$": {
                    //         [Op.iLike]: `%${searchQuery}%`,
                    //     },
                    // },
                    // {
                    //     "$department.name$": {
                    //         [Op.iLike]: `%${searchQuery}%`,
                    //     },
                    // },
                ],
            };
        }

        return await this.employeeRepository.findAndCountAll({
            limit,
            offset,
            transaction,
            //subQuery: true, // без этого аттрибута косячил поиск на фронтенде
            attributes: [
                "id",
                "surname",
                "name",
                "hireDate",
                "dismissDate",
                "rank",
            ],
            include: [
                {
                    model: Berth,
                    include: [BerthType],
                    attributes: ["id", "value"],
                },
                {
                    model: Department,
                    include: [
                        { model: Organization, attributes: ["id", "name"] },
                    ],
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
            ],
            where,
            distinct: true, // Обязательно потому что выдает неверное количество записей при пописке
            order: [["surname", "ASC"]],
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        console.log(">>> FindOne employee by id=" + id);
        return await this.employeeRepository.findOne({
            where: { id },
            attributes: [
                "id",
                "surname",
                "name",
                "hireDate",
                "dismissDate",
                "email",
                "phone",
                "rank",
            ],
            include: [
                {
                    model: Berth,
                    include: [BerthType],
                    attributes: ["id", "value"],
                },
                {
                    model: Department,
                    include: [
                        { model: Organization, attributes: ["id", "name"] },
                    ],
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
            ],
            transaction,
        });
    }

    async save(id: string, updateEmployeeDto: EmployeeDto) {
        console.log(">>> Start save employee");
        const transaction = await this.sequelize.transaction();
        console.log("DTO: " + JSON.stringify(updateEmployeeDto));

        try {
            // const employeeData: EmployeeDto = {
            //     surname: updateEmployeeDto.surname,
            //     name: updateEmployeeDto.name,
            //     hireDate: updateEmployeeDto.hireDate,
            //     dismissDate: updateEmployeeDto.dismissDate,
            //     email: updateEmployeeDto.email,
            //     phone: updateEmployeeDto.phone,
            //     rank: updateEmployeeDto.rank,
            //     berth: null,
            //     department: null
            // };

            let employee = null;

            if (id) {
                employee = await this.findOne(+id, transaction);

                if (!employee) {
                    console.log(">>> Error finding employee");
                    throw new BadRequestException(
                        "Ошибка при обновлении/создании пользователя",
                    );
                }

                // Обновление информации пользователя
                await this.employeeRepository.update(updateEmployeeDto, {
                    where: { id },
                    transaction,
                });
            } else {
                employee = await this.employeeRepository.create(
                    updateEmployeeDto,
                    {
                        transaction,
                    },
                );

                if (!employee) {
                    console.log(">>> Error creating employee");
                    throw new BadRequestException(
                        "Ошибка при обновлении/создании пользователя",
                    );
                }
            }

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

            await employee.reload();

            return employee;
        } catch (error) {
            await transaction.rollback();
            console.log("Rollback error: " + JSON.stringify(error));
            throw error;
        }
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.employeeRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
