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
import { departmentTableAttributes } from "../../infrastructure/const/tableAttributes";
import { Employee } from "../employees/entities/employee.entity";
import { Organization } from "../organizations/entities/organization.entity";
import { OrganizationsService } from "../organizations/organizations.service";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { CreateDepartmentDto } from "./dto/createDepartment.dto";
import { CreateDepartmentExtendedDto } from "./dto/createDepartmentExtended.dto";
import { UpdateDepartmentDto } from "./dto/updateDepartment.dto";
import { Department } from "./entities/department.entity";

@Injectable()
export class DepartmentsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Department)
        private departmentsRepository: typeof Department,
        private sequelize: Sequelize,
        private workspaceService: WorkspacesService,
        @Inject(forwardRef(() => OrganizationsService))
        private organizationService: OrganizationsService,
    ) {
        // Параметры запросов к БД
        this.attributes = departmentTableAttributes;
        this.include = [
            { model: Workspace },
            { model: Employee, required: false },
            { model: Organization, required: false },
        ];
    }

    async create(
        createDepartmentDto: CreateDepartmentDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.departmentsRepository.create(
                createDepartmentDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createDepartmentDto: CreateDepartmentExtendedDto,
        workspaceId: number,
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

            const department = await this.create(
                createDepartmentDto,
                transaction,
            );

            await department.$set("workspace", [workspace.id], {
                transaction,
            });

            if (!createDepartmentDto.organization) {
                throw new BadRequestException("Организация не задана!");
            }

            const organization = await this.organizationService.findOne(
                createDepartmentDto.organization.id,
                transaction,
            );

            if (!organization) {
                throw new InternalServerErrorException(
                    "Организация не найдена!",
                );
            }

            // Связываем с организацией
            await department.$set("organization", [organization.id], {
                transaction,
            });

            await transaction.commit();

            // Возвращаем полностью объект
            if (department) {
                // Обновляем значения
                return await department.reload({
                    attributes: this.attributes,
                    include: this.include,
                });
            }
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async update(
        id: number,
        updateDepartmentDto: UpdateDepartmentDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.departmentsRepository.update(
                    updateDepartmentDto,
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

    async updateExtended(id: number, updateDepartmentDto: UpdateDepartmentDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const department = await this.findOne(id, transaction);

            if (!department) {
                throw new BadRequestException("Подразделение не найдено");
            }

            await this.update(id, updateDepartmentDto, transaction);

            await transaction.commit();

            return await this.findOne(id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(
        workspaceId: number,
        organizationId?: string,
        limit?: number,
        offset?: number,
        transaction?: Transaction,
    ) {
        try {
            if (!limit || !offset) {
                if (!organizationId) {
                    return await this.departmentsRepository.findAndCountAll({
                        where: {
                            "$workspace.id$": workspaceId,
                        },
                        attributes: this.attributes,
                        include: this.include,
                        order: [["name", "ASC"]],
                        distinct: true,
                        transaction,
                    });
                } else {
                    return await this.departmentsRepository.findAndCountAll({
                        where: {
                            "$workspace.id$": workspaceId,
                            "$organization.id$": +organizationId,
                        },
                        attributes: this.attributes,
                        include: this.include,
                        order: [["name", "ASC"]],
                        distinct: true,
                        transaction,
                    });
                }
            } else {
                if (!organizationId) {
                    return await this.departmentsRepository.findAndCountAll({
                        where: {
                            "$workspace.id$": workspaceId,
                        },
                        limit,
                        offset,
                        attributes: this.attributes,
                        include: this.include,
                        order: [["name", "ASC"]],
                        distinct: true,
                        transaction,
                    });
                } else {
                    return await this.departmentsRepository.findAndCountAll({
                        where: {
                            "$workspace.id$": workspaceId,
                            "$organization.id$": +organizationId,
                        },
                        limit,
                        offset,
                        attributes: this.attributes,
                        include: this.include,
                        order: [["name", "ASC"]],
                        distinct: true,
                        transaction,
                    });
                }
            }
        } catch (e) {
            throw e;
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.departmentsRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["name", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Участок не найден");
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
                throw new BadRequestException("Подразделение не найдено");
            }

            return await this.departmentsRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
