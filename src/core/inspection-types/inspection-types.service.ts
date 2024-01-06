import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction, ValidationError } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    inspectionTypeTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateInspectionTypeDto } from "./dto/create-inspection-type.dto";
import { UpdateInspectionTypeDto } from "./dto/update-inspection-type.dto";
import { InspectionType } from "./entities/inspection-type.entity";

@Injectable()
export class InspectionTypesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(InspectionType)
        private inspectionTypeRepository: typeof InspectionType,
        private sequelize: Sequelize,
    ) {
        // Параметры запросов к БД
        this.attributes = inspectionTypeTableAttributes;
        this.include = [
            { model: Workspace, attributes: workspaceTableAttributes },
        ];
    }

    async create(
        createInspectionTypeDto: CreateInspectionTypeDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.inspectionTypeRepository.create(
                createInspectionTypeDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            if (e instanceof ValidationError) {
                throw JSON.stringify(e.errors);
            }

            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createInspectionTypeDto: CreateInspectionTypeDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        console.log(
            "Create inspection type: " +
                JSON.stringify(createInspectionTypeDto),
        );

        try {
            const berthType = await this.create(
                createInspectionTypeDto,
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
            return await this.inspectionTypeRepository.findAndCountAll({
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
            const candidate = await this.inspectionTypeRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["value", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Тип проверки не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateInspectionTypeDto: UpdateInspectionTypeDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                await this.inspectionTypeRepository.update(
                    updateInspectionTypeDto,
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
                throw new BadRequestException("Тип проверки не найден");
            }

            return await this.inspectionTypeRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
