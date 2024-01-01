import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    certificateTableAttributes,
    certificateTypeTableAttributes,
    organizationTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { CertificateType } from "../certificate-types/entities/certificate-type.entity";
import { Organization } from "../organizations/entities/organization.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { CreateCertificateExtendedDto } from "./dto/createCertificateExtended.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { UpdateCertificateExtendedDto } from "./dto/updateCertificateExtended.dto";
import { Certificate } from "./entities/certificate.entity";

@Injectable()
export class CertificatesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Certificate)
        private certificateRepository: typeof Certificate,
        private sequelize: Sequelize,
    ) {
        // Параметры запросов к БД
        this.attributes = certificateTableAttributes;
        this.include = [
            {
                model: Workspace,
                attributes: workspaceTableAttributes,
                required: true,
            },
            { model: Organization, attributes: organizationTableAttributes },
            {
                model: CertificateType,
                attributes: certificateTypeTableAttributes,
            },
        ];
    }

    async create(
        createCertificateDto: CreateCertificateDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.certificateRepository.create(
                createCertificateDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createCertificateExtendedDto: CreateCertificateExtendedDto,
        workspaceId: number,
        organizationId?: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const certificate = await this.create(
                createCertificateExtendedDto as CreateCertificateDto,
                transaction,
            );

            await certificate.$set("workspace", [workspaceId], {
                transaction,
            });

            if (organizationId) {
                await certificate.$set("organization", [organizationId], {
                    transaction,
                });
            }

            if (createCertificateExtendedDto.certificateType) {
                await certificate.$set(
                    "certificateType",
                    [createCertificateExtendedDto.certificateType.id],
                    {
                        transaction,
                    },
                );
            }

            await transaction.commit();

            // Возвращаем полностью объект
            if (certificate) {
                // Обновляем значения
                return await this.findOne(certificate.id);
            }
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(
        workspaceId: number,
        organizationId?: number,
        transaction?: Transaction,
    ) {
        try {
            if (!organizationId) {
                return await this.certificateRepository.findAndCountAll({
                    where: {
                        "$workspace.id$": workspaceId,
                    },
                    attributes: this.attributes,
                    include: this.include,
                    order: [["number", "ASC"]],
                    distinct: true,
                    transaction,
                });
            } else {
                return await this.certificateRepository.findAndCountAll({
                    where: {
                        "$workspace.id$": workspaceId,
                        "$organization.id$": +organizationId,
                    },
                    attributes: this.attributes,
                    include: this.include,
                    order: [["number", "ASC"]],
                    distinct: true,
                    transaction,
                });
            }
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.certificateRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["number", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Удостоверение не найдена");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateCertificateDto: UpdateCertificateDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.certificateRepository.update(
                    updateCertificateDto,
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

    async updateExtended(
        id: number,
        updateCertificateExtendedDto: UpdateCertificateExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const certificate = await this.findOne(id, transaction);

            if (!certificate) {
                throw new BadRequestException("Удостоверение не найдено");
            }

            await this.update(
                id,
                updateCertificateExtendedDto as UpdateCertificateDto,
                transaction,
            );

            if (updateCertificateExtendedDto.certificateType) {
                await certificate.$set(
                    "certificateType",
                    [updateCertificateExtendedDto.certificateType.id],
                    {
                        transaction,
                    },
                );
            }

            await transaction.commit();

            return await this.findOne(id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async remove(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Удостоверение не найдено");
            }

            return await this.certificateRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
