import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { Department } from "./entities/department.entity";

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectModel(Department)
        private departmentsRepository: typeof Department,
    ) {}

    async create(
        createDepartmentDto: CreateDepartmentDto,
        transaction?: Transaction,
    ) {
        return await this.departmentsRepository.create(createDepartmentDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.departmentsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.departmentsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateDepartmentDto: UpdateDepartmentDto,
        transaction?: Transaction,
    ) {
        return await this.departmentsRepository.update(updateDepartmentDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.departmentsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
