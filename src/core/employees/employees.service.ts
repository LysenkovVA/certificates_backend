import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Transaction, WhereOptions } from "sequelize";
import { Berth } from "../berthes/entities/berth.entity";
import { Department } from "../departments/entities/department.entity";
import { User } from "../users/entity/users.entity";
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
            attributes: ["id", "surname", "name", "hireDate", "dismissDate"],
            include: [{ model: Berth }, Department, User],
            where,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.employeeRepository.findOne({
            where: { id },
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
