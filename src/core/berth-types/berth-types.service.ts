import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction, ValidationError } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    berthTypeTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { Workspace } from "../workspaces/entities/workspace.entity";
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
    ) {
        // Параметры запросов к БД
        this.attributes = berthTypeTableAttributes;
        this.include = [
            { model: Workspace, attributes: workspaceTableAttributes },
        ];
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
            if (e instanceof ValidationError) {
                throw JSON.stringify(e.errors);
            }

            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createBerthTypeDto: CreateBerthTypeDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const berthType = await this.create(
                createBerthTypeDto,
                transaction,
            );

            await berthType.$set("workspace", [workspaceId], {
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

    async findAll(workspaceId: number, transaction?: Transaction) {
        try {
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
                await this.berthTypeRepository.update(updateBerthTypeDto, {
                    where: { id },
                    transaction,
                });

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
