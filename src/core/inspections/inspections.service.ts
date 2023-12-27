import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { inspectionTableAttributes } from "../../infrastructure/const/tableAttributes";
import { ConstructionObject } from "../construction-objects/entities/construction-object.entity";
import { InspectionType } from "../inspection-types/entities/inspection-type.entity";
import { ResultDocumentType } from "../result_document_types/entities/result_document_type.entity";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { Inspection } from "./entities/inspection.entity";

@Injectable()
export class InspectionsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Inspection)
        private inspectionsRepository: typeof Inspection,
    ) {
        this.attributes = inspectionTableAttributes;
    }

    async create(
        createInspectionDto: CreateInspectionDto,
        transaction?: Transaction,
    ) {
        return await this.inspectionsRepository.create(createInspectionDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.inspectionsRepository.findAndCountAll({
            limit,
            offset,
            attributes: [
                "id",
                "date",
                "isPenalty",
                "isCommitional",
                "dateOfElimination",
                "documentNumber",
                "documentDate",
                "notes",
            ],
            include: [
                { model: InspectionType },
                { model: ConstructionObject },
                { model: ResultDocumentType },
            ],
            order: [["date", "DESC"]],
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.inspectionsRepository.findOne({
            where: { id },
            attributes: [
                "id",
                "date",
                "isPenalty",
                "isCommitional",
                "dateOfElimination",
                "documentNumber",
                "documentDate",
                "notes",
            ],
            include: [
                { model: InspectionType },
                { model: ConstructionObject },
                { model: ResultDocumentType },
            ],
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
