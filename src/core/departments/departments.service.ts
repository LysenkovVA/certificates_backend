import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Employee } from "../employees/entities/employee.entity";
import { Organization } from "../organizations/entities/organization.entity";
import { CreateDepartmentDto } from "./dto/createDepartment.dto";
import { UpdateDepartmentDto } from "./dto/updateDepartment.dto";
import { Department } from "./entities/department.entity";

@Injectable()
export class DepartmentsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Department)
        private departmentsRepository: typeof Department,
        private sequelize: Sequelize,
    ) {
        // Параметры запросов к БД
        this.attributes = ["id", "name"];
        this.include = [
            { model: Employee, required: false },
            { model: Organization, required: false },
        ];
    }

    async create(
        createDepartmentDto: CreateDepartmentDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.departmentsRepository.create(
                createDepartmentDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async update(
        id: number,
        updateDepartmentDto: UpdateDepartmentDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.departmentsRepository.update(
                    updateDepartmentDto,
                    {
                        where: { id },
                        transaction,
                    },
                );
            }
        } catch (e) {
            throw e;
        }
    }

    async findAll(limit?: number, offset?: number, transaction?: Transaction) {
        try {
            if (!limit || !offset) {
                return await this.departmentsRepository.findAndCountAll({
                    attributes: this.attributes,
                    include: this.include,
                    order: [["name", "ASC"]],
                    distinct: true,
                    transaction,
                });
            } else {
                return await this.departmentsRepository.findAndCountAll({
                    limit,
                    offset,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["name", "ASC"]],
                    distinct: true,
                    transaction,
                });
            }
        } catch (e) {
            throw e;
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.departmentsRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["name", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Участок не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async remove(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Участок не найден");
            }

            return await this.departmentsRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
