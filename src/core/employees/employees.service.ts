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
    berthTableAttributes,
    berthTypeTableAttributes,
    departmentTableAttributes,
    employeeTableAttributes,
    fileTableAttributes,
    organizationTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { BerthType } from "../berth-types/entities/berth-type.entity";
import { Berth } from "../berthes/entities/berth.entity";
import { Department } from "../departments/entities/department.entity";
import { File } from "../files/entities/file.entity";
import { FilesService } from "../files/files.service";
import { Organization } from "../organizations/entities/organization.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { CreateEmployeeDto } from "./dto/createEmployee.dto";
import { CreateEmployeeExtendedDto } from "./dto/createEmployeeExtended.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
import { UpdateEmployeeExtendedDto } from "./dto/updateEmployeeExtended.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Employee) private employeeRepository: typeof Employee,
        private sequelize: Sequelize,
        @Inject(forwardRef(() => FilesService))
        private fileService: FilesService,
    ) {
        // Параметры запросов к БД
        this.attributes = employeeTableAttributes;
        this.include = [
            {
                model: Workspace,
                attributes: workspaceTableAttributes,
                required: true,
            },
            {
                model: Organization,
                attributes: organizationTableAttributes,
                required: false,
            },
            {
                model: Berth,
                include: [
                    {
                        model: BerthType,
                        attributes: berthTypeTableAttributes,
                        required: false,
                    },
                ],
                attributes: berthTableAttributes,
                required: false,
            },
            {
                model: Department,
                attributes: departmentTableAttributes,
                required: false,
            },
            // {
            //     model: Certificate,
            //     include: [
            //         {
            //             model: CertificateType,
            //             attributes: certificateTypeTableAttributes,
            //         },
            //         {
            //             model: File,
            //             attributes: fileTableAttributes,
            //             as: "scans",
            //         },
            //         {
            //             model: File,
            //             attributes: fileTableAttributes,
            //             as: "protocols",
            //         },
            //     ],
            //     attributes: certificateTableAttributes,
            //     required: false,
            // },
            {
                model: File,
                attributes: fileTableAttributes,
                required: false,
            },
        ];
    }

    async uploadAvatar(avatar: Express.Multer.File, employeeId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const employee = await this.findOne(employeeId, transaction);

            if (!employee) {
                throw new InternalServerErrorException("Сотрудник не найден!");
            }

            const file = await this.fileService.uploadFile(
                avatar,
                employee.avatar?.id,
                transaction,
            );

            await employee.$set("avatar", [file.id], { transaction });

            await transaction.commit();

            return this.fileService.findOne(file.id);
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async deleteAvatar(employeeId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const employee = await this.findOne(employeeId, transaction);

            if (!employee) {
                throw new InternalServerErrorException("Сотрудник не найден!");
            }

            if (employee.avatar) {
                await this.fileService.remove(employee.avatar.id, transaction);
            }

            await employee.$set("avatar", null, { transaction });

            await transaction.commit();

            return true;
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async create(
        createEmployeeDto: CreateEmployeeDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.employeeRepository.create(createEmployeeDto, {
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        workspaceId: number,
        createEmployeeDto: CreateEmployeeExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const employee = await this.create(createEmployeeDto, transaction);

            await employee.$set("workspace", [workspaceId], {
                transaction,
            });

            // Организация
            if (createEmployeeDto.organization?.id) {
                await employee.$set(
                    "organization",
                    [createEmployeeDto.organization?.id],
                    {
                        transaction,
                    },
                );
            } else {
                await employee.$set("organization", null, { transaction });
            }

            // Должность
            if (createEmployeeDto.berth?.id) {
                await employee.$set("berth", [createEmployeeDto.berth?.id], {
                    transaction,
                });
            }

            // Участок
            if (createEmployeeDto.department?.id) {
                await employee.$set(
                    "department",
                    [createEmployeeDto.department?.id],
                    {
                        transaction,
                    },
                );
            }

            await transaction.commit();

            return this.findOne(employee.id);
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async update(
        id: number,
        updateEmployeeDto: UpdateEmployeeDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.employeeRepository.update(updateEmployeeDto, {
                    where: { id },
                    transaction,
                });
            }
        } catch (e) {
            throw e;
        }
    }

    async updateExtended(
        id: number,
        updateEmployeeDto: UpdateEmployeeExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const employee = await this.findOne(id, transaction);

            if (!employee) {
                throw new BadRequestException("Сотрудник не найден");
            }

            await this.update(
                id,
                updateEmployeeDto as UpdateEmployeeDto,
                transaction,
            );

            // Организация
            if (updateEmployeeDto.organization?.id) {
                await employee.$set(
                    "organization",
                    [updateEmployeeDto.organization?.id],
                    {
                        transaction,
                    },
                );
            } else {
                await employee.$set("organization", null, { transaction });
            }

            // Должность
            if (updateEmployeeDto.berth?.id) {
                await employee.$set("berth", [updateEmployeeDto.berth?.id], {
                    transaction,
                });
            } else {
                await employee.$set("berth", null, {
                    transaction,
                });
            }

            // Участок
            if (updateEmployeeDto.department?.id) {
                await employee.$set(
                    "department",
                    [updateEmployeeDto.department?.id],
                    {
                        transaction,
                    },
                );
            } else {
                await employee.$set("department", null, {
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

    async findAll(
        workspaceId: number,
        limit?: number,
        offset?: number,
        searchQuery?: string,
        transaction?: Transaction,
    ) {
        let where: WhereOptions<Employee> = null;
        if (searchQuery) {
            where = {
                "$workspace.id$": workspaceId,
                [Op.or]: [
                    {
                        surname: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        name: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        } else {
            where = { "$workspace.id$": workspaceId };
        }

        try {
            if (!limit || !offset) {
                return await this.employeeRepository.findAndCountAll({
                    where,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["surname", "ASC"]],
                    distinct: true,
                    transaction,
                });
            } else {
                return await this.employeeRepository.findAndCountAll({
                    limit,
                    offset,
                    where,
                    attributes: this.attributes,
                    include: this.include,
                    order: [["surname", "ASC"]],
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
            const candidate = await this.employeeRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["surname", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Сотрудник не найден");
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

            return await this.employeeRepository.destroy({
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
                throw new BadRequestException("Сотрудник не найден");
            }

            if (candidate.avatar) {
                await this.fileService.remove(candidate.avatar.id, transaction);
            }

            const result = await this.employeeRepository.destroy({
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
