import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateResultDocumentTypeDto } from "./dto/create-result_document_type.dto";
import { UpdateResultDocumentTypeDto } from "./dto/update-result_document_type.dto";
import { ResultDocumentType } from "./entities/result_document_type.entity";

@Injectable()
export class ResultDocumentTypesService {
    constructor(
        @InjectModel(ResultDocumentType)
        private resultDocumentTypesRepository: typeof ResultDocumentType,
    ) {}

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
