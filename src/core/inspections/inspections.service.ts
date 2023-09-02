import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { Inspection } from "./entities/inspection.entity";

@Injectable()
export class InspectionsService {
    constructor(
        @InjectModel(Inspection)
        private inspectionsRepository: typeof Inspection,
    ) {}

    async create(
        createInspectionDto: CreateInspectionDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionsRepository.create(createInspectionDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.inspectionsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.inspectionsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateInspectionDto: UpdateInspectionDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionsRepository.update(updateInspectionDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.inspectionsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
