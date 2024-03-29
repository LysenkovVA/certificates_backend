import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    berthTableAttributes,
    berthTypeTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { BerthType } from "../berth-types/entities/berth-type.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
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
    ) {
        // Параметры запросов к БД
        this.attributes = berthTableAttributes;
        this.include = [
            { model: Workspace, attributes: workspaceTableAttributes },
            { model: BerthType, attributes: berthTypeTableAttributes },
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
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const berth = await this.create(
                createBertheDto as CreateBerthDto,
                transaction,
            );

            await berth.$set("workspace", [workspaceId], {
                transaction,
            });

            if (createBertheDto.berthType) {
                await berth.$set("berthType", [createBertheDto.berthType.id], {
                    transaction,
                });
            }

            await transaction.commit();

            return await this.findOne(berth.id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(workspaceId: number, transaction?: Transaction) {
        try {
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
