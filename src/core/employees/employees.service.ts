import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Transaction, WhereOptions } from "sequelize";
import { BerthType } from "../berth-types/entities/berth-type.entity";
import { Berth } from "../berthes/entities/berth.entity";
import { CertificateType } from "../certificate-types/entities/certificate-type.entity";
import { Certificate } from "../certificates/entities/certificate.entity";
import { Department } from "../departments/entities/department.entity";
import { Organization } from "../organizations/entities/organization.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
    constructor(
        @InjectModel(Employee) private employeeRepository: typeof Employee,
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
                    {
                        ["$berth.value$"]: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        ["$department.name$"]: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }

        return await this.employeeRepository.findAndCountAll({
            limit,
            offset,
            transaction,
            subQuery: false, // без этого аттрибута косячил поиск на фронтенде
            attributes: ["id", "surname", "name", "hireDate", "dismissDate"],
            include: [Berth, Department, Certificate],
            where,
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
                    include: [CertificateType],
                    attributes: ["id", "number", "startDate", "group"],
                },
            ],
            transaction,
        });
    }

    async update(
        id: number,
        updateEmployeeDto: UpdateEmployeeDto,
        transaction?: Transaction,
    ) {
        return await this.employeeRepository.update(updateEmployeeDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.employeeRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
