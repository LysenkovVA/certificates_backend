import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { inspectionViolationTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateInspectionViolationDto } from "./dto/create-inspection-violation.dto";
import { UpdateInspectionViolationDto } from "./dto/update-inspection-violation.dto";
import { InspectionViolation } from "./entities/inspection-violation.entity";

@Injectable()
export class InspectionViolationsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(InspectionViolation)
        private inspectionViolationsRepository: typeof InspectionViolation,
    ) {
        this.attributes = inspectionViolationTableAttributes;
    }

    async create(
        createInspectionViolationDto: CreateInspectionViolationDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionViolationsRepository.create(
            createInspectionViolationDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.inspectionViolationsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.inspectionViolationsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateInspectionViolationDto: UpdateInspectionViolationDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionViolationsRepository.update(
            updateInspectionViolationDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.inspectionViolationsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
