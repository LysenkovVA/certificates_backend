import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    certificateTypeTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateCertificateTypeDto } from "./dto/create-certificate-type.dto";
import { UpdateCertificateTypeDto } from "./dto/update-certificate-type.dto";
import { CertificateType } from "./entities/certificate-type.entity";

@Injectable()
export class CertificateTypesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(CertificateType)
        private certificateTypeRepository: typeof CertificateType,
        private sequelize: Sequelize,
    ) {
        // Параметры запросов к БД
        this.attributes = certificateTypeTableAttributes;
        this.include = [
            { model: Workspace, attributes: workspaceTableAttributes },
        ];
    }

    async create(
        createCertificateTypeDto: CreateCertificateTypeDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.certificateTypeRepository.create(
                createCertificateTypeDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createCertificateTypeDto: CreateCertificateTypeDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const certificateType = await this.create(
                createCertificateTypeDto,
                transaction,
            );

            await certificateType.$set("workspace", [workspaceId], {
                transaction,
            });

            await transaction.commit();

            // Возвращаем полностью объект
            if (certificateType) {
                return await this.findOne(certificateType.id);
            }
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(workspaceId: number, transaction?: Transaction) {
        try {
            return await this.certificateTypeRepository.findAndCountAll({
                where: {
                    "$workspace.id$": workspaceId,
                },
                attributes: this.attributes,
                include: this.include,
                order: [["value", "ASC"]],
                distinct: true,
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.certificateTypeRepository.findByPk(
                id,
                {
                    attributes: this.attributes,
                    include: this.include,
                    order: [["value", "ASC"]],
                    transaction,
                },
            );

            if (!candidate) {
                throw new BadRequestException("Тип удостоверения не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateCertificateTypeDto: UpdateCertificateTypeDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                await this.certificateTypeRepository.update(
                    updateCertificateTypeDto,
                    {
                        where: { id },
                        transaction,
                    },
                );

                return await this.findOne(candidate.id);
            }

            return null;
        } catch (e) {
            throw e;
        }
    }

    async remove(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Тип удостоверения не найден");
            }

            return await this.certificateTypeRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
