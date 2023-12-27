import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { resultDocumentTypeTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateResultDocumentTypeDto } from "./dto/create-result_document_type.dto";
import { UpdateResultDocumentTypeDto } from "./dto/update-result_document_type.dto";
import { ResultDocumentType } from "./entities/result_document_type.entity";

@Injectable()
export class ResultDocumentTypesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(ResultDocumentType)
        private resultDocumentTypesRepository: typeof ResultDocumentType,
    ) {
        this.attributes = resultDocumentTypeTableAttributes;
    }

    async create(
        createResultDocumentTypeDto: CreateResultDocumentTypeDto,
        transaction?: Transaction,
    ) {
        return await this.resultDocumentTypesRepository.create(
            createResultDocumentTypeDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.resultDocumentTypesRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.resultDocumentTypesRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateResultDocumentTypeDto: UpdateResultDocumentTypeDto,
        transaction?: Transaction,
    ) {
        return await this.resultDocumentTypesRepository.update(
            updateResultDocumentTypeDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.resultDocumentTypesRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
