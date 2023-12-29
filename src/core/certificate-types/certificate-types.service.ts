import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { certificateTypeTableAttributes } from "../../infrastructure/const/tableAttributes";
import { Organization } from "../organizations/entities/organization.entity";
import { OrganizationsService } from "../organizations/organizations.service";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { WorkspacesService } from "../workspaces/workspaces.service";
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
        private workspaceService: WorkspacesService,
        private organizationService: OrganizationsService,
    ) {
        // Параметры запросов к БД
        this.attributes = certificateTypeTableAttributes;
        this.include = [{ model: Workspace }, { model: Organization }];
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
        organizationId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const workspace = await this.workspaceService.findOne(
                workspaceId,
                transaction,
            );

            if (!workspace) {
                throw new InternalServerErrorException(
                    "Рабочее пространство не найдено!",
                );
            }

            const organization = await this.organizationService.findOne(
                organizationId,
                transaction,
            );

            if (!organization) {
                throw new InternalServerErrorException(
                    "Организация не найдена!",
                );
            }

            const certificateType = await this.create(
                createCertificateTypeDto,
                transaction,
            );

            await certificateType.$set("workspace", [workspace.id], {
                transaction,
            });

            await certificateType.$set("organization", [organization.id], {
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

    async findAll(
        workspaceId: number,
        organizationId?: string,
        transaction?: Transaction,
    ) {
        try {
            if (!organizationId) {
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
            } else {
                return await this.certificateTypeRepository.findAndCountAll({
                    where: {
                        "$workspace.id$": workspaceId,
                        "$organization.id$": +organizationId,
                    },
                    attributes: this.attributes,
                    include: this.include,
                    order: [["value", "ASC"]],
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
