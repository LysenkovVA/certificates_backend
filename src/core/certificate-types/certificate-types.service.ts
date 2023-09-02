import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateCertificateTypeDto } from "./dto/create-certificate-type.dto";
import { UpdateCertificateTypeDto } from "./dto/update-certificate-type.dto";
import { CertificateType } from "./entities/certificate-type.entity";

@Injectable()
export class CertificateTypesService {
    constructor(
        @InjectModel(CertificateType)
        private certificateTypesRepository: typeof CertificateType,
    ) {}

    async create(
        createCertificateTypeDto: CreateCertificateTypeDto,
        transaction?: Transaction,
    ) {
        return await this.certificateTypesRepository.create(
            createCertificateTypeDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.certificateTypesRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.certificateTypesRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateCertificateTypeDto: UpdateCertificateTypeDto,
        transaction?: Transaction,
    ) {
        return await this.certificateTypesRepository.update(
            updateCertificateTypeDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.certificateTypesRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
