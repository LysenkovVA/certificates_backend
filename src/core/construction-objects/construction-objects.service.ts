import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import {
    constructionObjectsTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { Inspection } from "../inspections/entities/inspection.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateConstructionObjectDto } from "./dto/createConstructionObject.dto";
import { UpdateConstructionObjectDto } from "./dto/updateConstructionObject.dto";
import { ConstructionObject } from "./entities/construction-object.entity";

@Injectable()
export class ConstructionObjectsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(ConstructionObject)
        private constructionObjectsRepository: typeof ConstructionObject,
    ) {
        // Параметры запросов к БД
        this.attributes = constructionObjectsTableAttributes;
        this.include = [
            { model: Inspection, required: false },
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

    async findAll(limit?: number, offset?: number, transaction?: Transaction) {
        try {
            if (!limit || !offset) {
                return await this.constructionObjectsRepository.findAndCountAll(
                    {
                        attributes: this.attributes,
                        include: this.include,
                        order: [["name", "ASC"]],
                        distinct: true,
                        transaction,
                    },
                );
            } else {
                return await this.constructionObjectsRepository.findAndCountAll(
                    {
                        limit,
                        offset,
                        attributes: this.attributes,
                        include: this.include,
                        order: [["name", "ASC"]],
                        distinct: true,
                        transaction,
                    },
                );
            }
        } catch (e) {
            throw e;
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

    async remove(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Объект не найден");
            }

            return await this.constructionObjectsRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
