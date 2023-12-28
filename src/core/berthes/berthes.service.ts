import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { berthTableAttributes } from "../../infrastructure/const/tableAttributes";
import { BerthType } from "../berth-types/entities/berth-type.entity";
import { Organization } from "../organizations/entities/organization.entity";
import { OrganizationsService } from "../organizations/organizations.service";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateBerthDto } from "./dto/create-berth.dto";
import { CreateBerthExtendedDto } from "./dto/createBerthExtended.dto";
import { UpdateBerthDto } from "./dto/update-berth.dto";
import { UpdateBerthExtendedDto } from "./dto/updateBerthExtended.dto";
import { Berth } from "./entities/berth.entity";

@Injectable()
export class BerthesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Berth) private berthRepository: typeof Berth,
        private sequelize: Sequelize,
        private workspaceService: WorkspacesService,
        private organizationService: OrganizationsService,
    ) {
        // Параметры запросов к БД
        this.attributes = berthTableAttributes;
        this.include = [
            { model: Workspace },
            { model: Organization },
            { model: BerthType },
        ];
    }

    async create(createBertheDto: CreateBerthDto, transaction?: Transaction) {
        try {
            return await this.berthRepository.create(createBertheDto, {
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createBertheDto: CreateBerthExtendedDto,
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

            const berth = await this.create(
                createBertheDto as CreateBerthDto,
                transaction,
            );

            await berth.$set("workspace", [workspace.id], {
                transaction,
            });

            await berth.$set("organization", [organization.id], {
                transaction,
            });

            if (createBertheDto.berthType) {
                await berth.$set("berthType", [createBertheDto.berthType.id], {
                    transaction,
                });
            }

            await transaction.commit();

            // Возвращаем полностью объект
            if (berth) {
                // Обновляем значения
                return await berth.reload({
                    attributes: this.attributes,
                    include: this.include,
                });
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
                return await this.berthRepository.findAndCountAll({
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
                return await this.berthRepository.findAndCountAll({
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
            const candidate = await this.berthRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["value", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Должность не найдена");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateBertheDto: UpdateBerthDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.berthRepository.update(updateBertheDto, {
                    where: { id },
                    transaction,
                });
            }
        } catch (e) {
            throw e;
        }
    }

    async updateExtended(id: number, updateBertheDto: UpdateBerthExtendedDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const berth = await this.findOne(id, transaction);

            if (!berth) {
                throw new BadRequestException("Должность не найдена");
            }

            await this.update(
                id,
                updateBertheDto as UpdateBerthDto,
                transaction,
            );

            if (updateBertheDto.berthType) {
                await berth.$set("berthType", [updateBertheDto.berthType.id], {
                    transaction,
                });
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
                throw new BadRequestException("Должность не найдена");
            }

            return await this.berthRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
