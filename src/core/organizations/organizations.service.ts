import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Op, Transaction, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    constructionObjectsTableAttributes,
    departmentTableAttributes,
    organizationTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { ConstructionObjectsService } from "../construction-objects/construction-objects.service";
import { CreateConstructionObjectDto } from "../construction-objects/dto/createConstructionObject.dto";
import { ConstructionObject } from "../construction-objects/entities/construction-object.entity";
import { DepartmentsService } from "../departments/departments.service";
import { CreateDepartmentDto } from "../departments/dto/createDepartment.dto";
import { Department } from "../departments/entities/department.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateOrganizationDto } from "./dto/createOrganization.dto";
import { CreateOrganizationExtendedDto } from "./dto/createOrganizationExtended.dto";
import { UpdateOrganizationDto } from "./dto/updateOrganization.dto";
import { UpdateOrganizationExtendedDto } from "./dto/updateOrganizationExtended.dto";
import { Organization } from "./entities/organization.entity";

@Injectable()
export class OrganizationsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Organization)
        private organizationRepository: typeof Organization,
        private sequelize: Sequelize,
        @Inject(forwardRef(() => DepartmentsService))
        private departmentsService: DepartmentsService,
        private constructionObjectsService: ConstructionObjectsService,
    ) {
        // Параметры запросов к БД
        this.attributes = organizationTableAttributes;
        this.include = [
            {
                model: Department,
                attributes: departmentTableAttributes,
                required: false,
            },
            {
                model: ConstructionObject,
                attributes: constructionObjectsTableAttributes,
                required: false,
            },
            {
                model: Workspace,
                attributes: workspaceTableAttributes,
                required: true,
            },
        ];
    }

    private async create(
        createOrganizationDto: CreateOrganizationDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.organizationRepository.create(
                createOrganizationDto,
                {
                    transaction,
                },
            );
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    private async update(
        id: number,
        updateOrganizationDto: UpdateOrganizationDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.organizationRepository.update(
                    updateOrganizationDto,
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

    async createExtended(
        createOrganizationExtendedDto: CreateOrganizationExtendedDto,
        workspaceId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const organization = await this.create(
                createOrganizationExtendedDto as CreateOrganizationDto,
                transaction,
            );

            await organization.$set("workspace", [workspaceId], {
                transaction,
            });

            // Добавляем или обновляем участки
            if (createOrganizationExtendedDto.departments) {
                for (const department of createOrganizationExtendedDto.departments) {
                    if (department.id) {
                        await this.departmentsService.update(
                            department.id,
                            department,
                            transaction,
                        );
                    } else {
                        const newDepartment =
                            await this.departmentsService.create(
                                department as CreateDepartmentDto,
                                transaction,
                            );

                        if (newDepartment) {
                            await newDepartment.$set(
                                "workspace",
                                [workspaceId],
                                { transaction },
                            );

                            await organization.$add(
                                "departments",
                                [newDepartment.id],
                                { transaction },
                            );
                        }
                    }
                }
            }

            // Добавляем или обновляем объекты
            if (createOrganizationExtendedDto.constructionObjects) {
                for (const constructionObject of createOrganizationExtendedDto.constructionObjects) {
                    if (constructionObject.id) {
                        await this.constructionObjectsService.update(
                            constructionObject.id,
                            constructionObject,
                            transaction,
                        );
                    } else {
                        const newConstructionObject =
                            await this.constructionObjectsService.create(
                                constructionObject as CreateConstructionObjectDto,
                                transaction,
                            );

                        if (newConstructionObject) {
                            await newConstructionObject.$set(
                                "workspace",
                                [workspaceId],
                                { transaction },
                            );

                            await organization.$add(
                                "constructionObjects",
                                [newConstructionObject.id],
                                { transaction },
                            );
                        }
                    }
                }
            }

            await transaction.commit();

            // Возвращаем полностью объект
            if (organization) {
                // Обновляем значения
                return await organization.reload({
                    attributes: this.attributes,
                    include: this.include,
                });
            }
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async updateExtended(
        id: number,
        updateOrganizationExtendedDto: UpdateOrganizationExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const organization = await this.findOne(id, transaction);

            if (!organization) {
                throw new BadRequestException("Организация не найдена");
            }

            await this.update(
                id,
                updateOrganizationExtendedDto as UpdateOrganizationDto,
                transaction,
            );

            // Удаляем старые участки
            await organization.$set("departments", null, { transaction });

            // Добавляем или обновляем участки
            for (const department of updateOrganizationExtendedDto.departments) {
                if (department.id) {
                    // Обновляем информацию
                    await this.departmentsService.update(
                        department.id,
                        department,
                        transaction,
                    );

                    // Добавляем к организации
                    await organization.$add("departments", [department.id], {
                        transaction,
                    });
                } else {
                    // Создаем новый участок
                    const newDepartment = await this.departmentsService.create(
                        department as CreateDepartmentDto,
                        transaction,
                    );

                    // Добавляем к организации
                    if (newDepartment) {
                        await organization.$add(
                            "departments",
                            [newDepartment.id],
                            { transaction },
                        );

                        await newDepartment.$set(
                            "workspace",
                            [organization.workspace.id],
                            { transaction },
                        );
                    }
                }
            }

            // Удаляем старые объекты
            await organization.$set("constructionObjects", null, {
                transaction,
            });

            // Добавляем или обновляем объекты
            for (const constructionObject of updateOrganizationExtendedDto.constructionObjects) {
                if (constructionObject.id) {
                    // Обновляем информацию
                    await this.constructionObjectsService.update(
                        constructionObject.id,
                        constructionObject,
                        transaction,
                    );

                    await organization.$add(
                        "constructionObjects",
                        [constructionObject.id],
                        { transaction },
                    );
                } else {
                    // Создаем новый объект
                    const newConstructionObject =
                        await this.constructionObjectsService.create(
                            constructionObject as CreateConstructionObjectDto,
                            transaction,
                        );

                    if (newConstructionObject) {
                        await organization.$add(
                            "constructionObjects",
                            [newConstructionObject.id],
                            { transaction },
                        );

                        await newConstructionObject.$set(
                            "workspace",
                            [organization.workspace.id],
                            { transaction },
                        );
                    }
                }
            }

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
            const whereOptions: WhereOptions<Organization> = !searchQuery
                ? { "$workspace.id$": workspaceId }
                : {
                      "$workspace.id$": workspaceId,
                      name: {
                          [Op.iLike]: `%${searchQuery}%`,
                      },
                  };

            if (!limit || !offset) {
                return await this.organizationRepository.findAndCountAll({
                    where: whereOptions,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["name", "ASC"]],
                    distinct: true,
                    transaction,
                });
            } else {
                return await this.organizationRepository.findAndCountAll({
                    limit,
                    offset,
                    where: whereOptions,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["name", "ASC"]],
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
            const candidate = await this.organizationRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["name", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Организация не найдена");
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
                throw new BadRequestException("Организация не найдена");
            }

            return await this.organizationRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
