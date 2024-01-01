import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    inspectionTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { UpdateEmployeeDto } from "../employees/dto/updateEmployee.dto";
import { FilesService } from "../files/files.service";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { CreateInspectionExtendedDto } from "./dto/createInspectionExtended.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { UpdateInspectionExtendedDto } from "./dto/updateInspectionExtended.dto";
import { Inspection } from "./entities/inspection.entity";

@Injectable()
export class InspectionsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Inspection)
        private inspectionsRepository: typeof Inspection,
        private sequelize: Sequelize,
        @Inject(forwardRef(() => FilesService))
        private fileService: FilesService,
    ) {
        this.attributes = inspectionTableAttributes;
        this.include = [
            {
                model: Workspace,
                attributes: workspaceTableAttributes,
                required: true,
            },
        ];
    }

    // async uploadAvatar(avatar: Express.Multer.File, employeeId: number) {
    //     const transaction = await this.sequelize.transaction();
    //
    //     try {
    //         const employee = await this.findOne(employeeId, transaction);
    //
    //         if (!employee) {
    //             throw new InternalServerErrorException("Сотрудник не найден!");
    //         }
    //
    //         const file = await this.fileService.uploadFile(
    //           avatar,
    //           employee.avatar?.id,
    //           transaction,
    //         );
    //
    //         await employee.$set("avatar", [file.id], { transaction });
    //
    //         await transaction.commit();
    //
    //         return this.fileService.findOne(file.id);
    //     } catch (e) {
    //         await transaction.rollback();
    //         throw new InternalServerErrorException(e);
    //     }
    // }
    //
    // async deleteAvatar(employeeId: number) {
    //     const transaction = await this.sequelize.transaction();
    //
    //     try {
    //         const employee = await this.findOne(employeeId, transaction);
    //
    //         if (!employee) {
    //             throw new InternalServerErrorException("Сотрудник не найден!");
    //         }
    //
    //         if (employee.avatar) {
    //             await this.fileService.remove(employee.avatar.id, transaction);
    //         }
    //
    //         await employee.$set("avatar", null, { transaction });
    //
    //         await transaction.commit();
    //
    //         return true;
    //     } catch (e) {
    //         await transaction.rollback();
    //         throw new InternalServerErrorException(e);
    //     }
    // }

    async create(
        createInspectionDto: CreateInspectionDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.inspectionsRepository.create(
                createInspectionDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        workspaceId: number,
        createInspectionExtendedDto: CreateInspectionExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const inspection = await this.create(
                createInspectionExtendedDto as CreateInspectionDto,
                transaction,
            );

            await inspection.$set("workspace", [workspaceId], {
                transaction,
            });

            await transaction.commit();

            return this.findOne(inspection.id);
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async update(
        id: number,
        updateInspectionDto: UpdateInspectionDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.inspectionsRepository.update(
                    updateInspectionDto,
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
        updateInspectionExtendedDto: UpdateInspectionExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const inspection = await this.findOne(id, transaction);

            if (!inspection) {
                throw new BadRequestException("Проверка не найдена");
            }

            await this.update(
                id,
                updateInspectionExtendedDto as UpdateEmployeeDto,
                transaction,
            );

            await transaction.commit();

            return await this.findOne(id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(
        workspaceId: number,
        limit?: number,
        offset?: number,
        searchQuery?: string,
        transaction?: Transaction,
    ) {
        try {
            if (!limit || !offset) {
                return await this.inspectionsRepository.findAndCountAll({
                    where: { "$workspace.id$": workspaceId },
                    attributes: this.attributes,
                    include: this.include,
                    order: [["date", "ASC"]],
                    distinct: true,
                    transaction,
                });
            } else {
                return await this.inspectionsRepository.findAndCountAll({
                    limit,
                    offset,
                    where: { "$workspace.id$": workspaceId },
                    attributes: this.attributes,
                    include: this.include,
                    order: [["date", "ASC"]],
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
            const candidate = await this.inspectionsRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["date", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Проверка не найдена");
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
                throw new BadRequestException("Сотрудник не найден");
            }

            return await this.inspectionsRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }

    async removeExtended(id: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Проверка не найдена");
            }

            // if (candidate.avatar) {
            //     await this.fileService.remove(candidate.avatar.id, transaction);
            // }

            const result = await this.inspectionsRepository.destroy({
                where: { id },
                transaction,
            });

            await transaction.commit();
            return result;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
