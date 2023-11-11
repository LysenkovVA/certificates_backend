import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Transaction } from "sequelize";
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
        if (!searchQuery) {
            return await this.employeeRepository.findAll({
                limit,
                offset,
                transaction,
            });
        }

        return await this.employeeRepository.findAll({
            limit,
            offset,
            transaction,
            where: {
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
            },
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
