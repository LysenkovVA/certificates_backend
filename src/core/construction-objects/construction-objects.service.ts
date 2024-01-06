import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    constructionObjectsTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateConstructionObjectDto } from "./dto/createConstructionObject.dto";
import { CreateConstructionObjectExtendedDto } from "./dto/createConstructionObjectExtended.dto";
import { UpdateConstructionObjectDto } from "./dto/updateConstructionObject.dto";
import { UpdateConstructionObjectExtendedDto } from "./dto/updateConstructionObjectExtended.dto";
import { ConstructionObject } from "./entities/construction-object.entity";

@Injectable()
export class ConstructionObjectsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(ConstructionObject)
        private constructionObjectsRepository: typeof ConstructionObject,
        private sequelize: Sequelize,
    ) {
        // Параметры запросов к БД
        this.attributes = constructionObjectsTableAttributes;
        this.include = [
            {
                model: Workspace,
                attributes: workspaceTableAttributes,
                required: true,
            },
        ];
    }

    async create(
        createConstructionObjectDto: CreateConstructionObjectDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.constructionObjectsRepository.create(
                createConstructionObjectDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createConstructionObjectExtendedDto: CreateConstructionObjectExtendedDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const co = await this.create(
                createConstructionObjectExtendedDto as CreateConstructionObjectDto,
                transaction,
            );

            await co.$set("workspace", [workspaceId], {
                transaction,
            });

            await transaction.commit();

            return await this.findOne(co.id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(workspaceId: number, transaction?: Transaction) {
        try {
            return await this.constructionObjectsRepository.findAndCountAll({
                where: {
                    "$workspace.id$": workspaceId,
                },
                attributes: this.attributes,
                include: this.include,
                order: [["name", "ASC"]],
                distinct: true,
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.constructionObjectsRepository.findByPk(
                id,
                {
                    attributes: this.attributes,
                    include: this.include,
                    order: [["name", "ASC"]],
                    transaction,
                },
            );

            if (!candidate) {
                throw new BadRequestException("Объект не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateConstructionObjectDto: UpdateConstructionObjectDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.constructionObjectsRepository.update(
                    updateConstructionObjectDto,
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
        updateConstructionObjectExtendedDto: UpdateConstructionObjectExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const co = await this.findOne(id, transaction);

            await this.update(
                id,
                updateConstructionObjectExtendedDto as UpdateConstructionObjectDto,
                transaction,
            );

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

            return await this.constructionObjectsRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
