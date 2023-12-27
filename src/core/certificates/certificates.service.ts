import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { certificateTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CertificateType } from "../certificate-types/entities/certificate-type.entity";
import { Employee } from "../employees/entities/employee.entity";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { Certificate } from "./entities/certificate.entity";

@Injectable()
export class CertificatesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Certificate)
        private certificateRepository: typeof Certificate,
    ) {
        this.attributes = certificateTableAttributes;
    }

    async create(
        createCertificateDto: CreateCertificateDto,
        transaction?: Transaction,
    ) {
        return await this.certificateRepository.create(createCertificateDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.certificateRepository.findAndCountAll({
            limit,
            offset,
            transaction,
            include: [{ model: CertificateType }],
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.certificateRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async fetchByEmployeeId(employeeId: number, transaction?: Transaction) {
        return await this.certificateRepository.findAndCountAll({
            where: {
                "$employee.id$": employeeId,
            },
            include: [Employee],
            transaction,
        });
    }

    async update(
        id: number,
        updateCertificateDto: UpdateCertificateDto,
        transaction?: Transaction,
    ) {
        return await this.certificateRepository.update(updateCertificateDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.certificateRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
