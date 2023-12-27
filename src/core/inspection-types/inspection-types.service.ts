import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { inspectionTypeTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateInspectionTypeDto } from "./dto/create-inspection-type.dto";
import { UpdateInspectionTypeDto } from "./dto/update-inspection-type.dto";
import { InspectionType } from "./entities/inspection-type.entity";

@Injectable()
export class InspectionTypesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(InspectionType)
        private inspectionTypesRepository: typeof InspectionType,
    ) {
        this.attributes = inspectionTypeTableAttributes;
    }

    async create(
        createInspectionTypeDto: CreateInspectionTypeDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionTypesRepository.create(
            createInspectionTypeDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.inspectionTypesRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.inspectionTypesRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateInspectionTypeDto: UpdateInspectionTypeDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionTypesRepository.update(
            updateInspectionTypeDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.inspectionTypesRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
