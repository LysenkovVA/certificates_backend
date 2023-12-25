import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Organization } from "../organizations/entities/organization.entity";
import { OrganizationsService } from "../organizations/organizations.service";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateBerthTypeDto } from "./dto/create-berth-type.dto";
import { UpdateBerthTypeDto } from "./dto/update-berth-type.dto";
import { BerthType } from "./entities/berth-type.entity";

@Injectable()
export class BerthTypesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(BerthType) private berthTypeRepository: typeof BerthType,
        private sequelize: Sequelize,
        private workspaceService: WorkspacesService,
        private organizationService: OrganizationsService,
    ) {
        // Параметры запросов к БД
        this.attributes = ["id", "value"];
        this.include = [{ model: Workspace }, { model: Organization }];
    }

    async create(
        createBerthTypeDto: CreateBerthTypeDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.berthTypeRepository.create(createBerthTypeDto, {
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createBerthTypeDto: CreateBerthTypeDto,
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

            const berthType = await this.create(
                createBerthTypeDto,
                transaction,
            );

            await berthType.$set("workspace", [workspace.id], {
                transaction,
            });

            await berthType.$set("organization", [organization.id], {
                transaction,
            });

            await transaction.commit();

            // Возвращаем полностью объект
            if (berthType) {
                return await this.findOne(berthType.id);
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
                return await this.berthTypeRepository.findAndCountAll({
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
                return await this.berthTypeRepository.findAndCountAll({
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
            const candidate = await this.berthTypeRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["value", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Тип должности не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateBerthTypeDto: UpdateBerthTypeDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.berthTypeRepository.update(
                    updateBerthTypeDto,
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

    async remove(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Тип должности не найден");
            }

            return await this.berthTypeRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
