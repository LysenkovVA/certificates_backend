import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
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
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
    constructor(
        @InjectModel(Employee) private employeeRepository: typeof Employee,
        private sequelize: Sequelize,
        private berthService: BerthesService,
        private departmentService: DepartmentsService,
    ) {}

    async create(
        createEmployeeDto: CreateEmployeeDto,
        transaction?: Transaction,
    ) {
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

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const employeeData = {
                surname: updateEmployeeDto.surname,
                name: updateEmployeeDto.name,
                hireDate: updateEmployeeDto.hireDate,
                dismissDate: updateEmployeeDto.dismissDate,
                email: updateEmployeeDto.email,
                phone: updateEmployeeDto.phone,
                rank: updateEmployeeDto.rank,
            };

            // Обновление информации пользователя
            const result = await this.employeeRepository.update(employeeData, {
                where: { id },
                transaction,
            });

            const employee = await this.findOne(id, transaction);

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
