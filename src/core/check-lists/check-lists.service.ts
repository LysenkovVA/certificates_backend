import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    checkListTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateCheckListDto } from "./dto/create-check-list.dto";
import { CreateCheckListExtendedDto } from "./dto/createCheckListExtended.dto";
import { UpdateCheckListDto } from "./dto/update-check-list.dto";
import { UpdateCheckListExtendedDto } from "./dto/updateCheckListExtended.dto";
import { CheckList } from "./entities/check-list.entity";

@Injectable()
export class CheckListsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(CheckList) private checkListRepository: typeof CheckList,
        private sequelize: Sequelize,
    ) {
        // Параметры запросов к БД
        this.attributes = checkListTableAttributes;
        this.include = [
            { model: Workspace, attributes: workspaceTableAttributes },
        ];
    }

    async create(
        createCheckListDto: CreateCheckListDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.checkListRepository.create(createCheckListDto, {
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createCheckListExtendedDto: CreateCheckListExtendedDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const item = await this.create(
                createCheckListExtendedDto as CreateCheckListDto,
                transaction,
            );

            await item.$set("workspace", [workspaceId], {
                transaction,
            });

            await transaction.commit();

            return await this.findOne(item.id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(workspaceId: number, transaction?: Transaction) {
        try {
            return await this.checkListRepository.findAndCountAll({
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
            const candidate = await this.checkListRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["name", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Список не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateCheckListDto: UpdateCheckListDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.checkListRepository.update(
                    updateCheckListDto,
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
        updateCheckListExtendedDto: UpdateCheckListExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Список не найден");
            }

            await this.update(
                id,
                updateCheckListExtendedDto as UpdateCheckListDto,
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

            if (!candidate) {
                throw new BadRequestException("Список не найден");
            }

            return await this.checkListRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
