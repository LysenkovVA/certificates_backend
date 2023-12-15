import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { ConstructionObjectsService } from "../construction-objects/construction-objects.service";
import { CreateConstructionObjectDto } from "../construction-objects/dto/createConstructionObject.dto";
import { ConstructionObject } from "../construction-objects/entities/construction-object.entity";
import { DepartmentsService } from "../departments/departments.service";
import { CreateDepartmentDto } from "../departments/dto/createDepartment.dto";
import { Department } from "../departments/entities/department.entity";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
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
        private departmentsService: DepartmentsService,
        private constructionObjectsService: ConstructionObjectsService,
        private userService: UsersService,
    ) {
        // Параметры запросов к БД
        this.attributes = ["id", "name"];
        this.include = [
            { model: Department, required: false },
            { model: ConstructionObject, required: false },
            { model: User },
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
        userId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const user = await this.userService.getUserById(userId);

            if (!user) {
                throw new InternalServerErrorException(
                    "Пользователь не найден!",
                );
            }

            const organization = await this.create(
                createOrganizationExtendedDto as CreateOrganizationDto,
                transaction,
            );

            await organization.$set("user", [user.id], { transaction });

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
        userId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const user = await this.userService.getUserById(userId);

            if (!user) {
                throw new InternalServerErrorException(
                    "Пользователь не найден!",
                );
            }

            const organization = await this.findOne(id, transaction);

            if (organization.user.id !== user.id) {
                throw new InternalServerErrorException(
                    "Пользователь не может изменить чужую организацию",
                );
            }

            if (!organization) {
                throw new BadRequestException("Организация не найдена");
            }

            await this.update(
                id,
                updateOrganizationExtendedDto as UpdateOrganizationDto,
                transaction,
            );

            // Удаляем старые участки
            await organization.$set("departments", [], { transaction });

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
                    }
                }
            }

            // Удаляем старые объекты
            await organization.$set("constructionObjects", [], { transaction });

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
        userId: number,
        limit?: number,
        offset?: number,
        transaction?: Transaction,
    ) {
        try {
            if (!limit || !offset) {
                return await this.organizationRepository.findAndCountAll({
                    where: {
                        "$user.id$": userId,
                    },
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
                    where: {
                        "$user.id$": userId,
                    },
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
