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
    fileTableAttributes,
    userTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { File } from "../files/entities/file.entity";
import { FilesService } from "../files/files.service";
import { User } from "../users/entity/users.entity";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { CreateWorkspaceExtendedDto } from "./dto/createWorkspaceExtended.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { UpdateWorkspaceExtendedDto } from "./dto/updateWorkspaceExtended.dto";
import { Workspace } from "./entities/workspace.entity";

@Injectable()
export class WorkspacesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Workspace) private workspaceRepository: typeof Workspace,
        private sequelize: Sequelize,
        @Inject(forwardRef(() => FilesService))
        private fileService: FilesService,
    ) {
        this.attributes = workspaceTableAttributes;
        this.include = [
            {
                model: User,
                attributes: userTableAttributes,
            },
            { model: File, attributes: fileTableAttributes },
        ];
    }

    async uploadLogo(logo: Express.Multer.File, workspaceId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const workspace = await this.findOne(workspaceId, transaction);

            if (!workspace) {
                throw new InternalServerErrorException(
                    "Организация не найдена!",
                );
            }

            const file = await this.fileService.uploadFile(
                logo,
                workspace.organizationLogo?.id,
                transaction,
            );

            await workspace.$set("organizationLogo", [file.id], {
                transaction,
            });

            await transaction.commit();

            return this.fileService.findOne(file.id);
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async deleteLogo(workspaceId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const workspace = await this.findOne(workspaceId, transaction);

            if (!workspace) {
                throw new InternalServerErrorException("Сотрудник не найден!");
            }

            if (workspace.organizationLogo) {
                await this.fileService.remove(
                    workspace.organizationLogo.id,
                    transaction,
                );
            }

            await workspace.$set("organizationLogo", null, { transaction });

            await transaction.commit();

            return true;
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async create(
        createWorkspaceDto: CreateWorkspaceDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.workspaceRepository.create(createWorkspaceDto, {
                transaction,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async createExtended(
        createWorkspaceExtendedDto: CreateWorkspaceExtendedDto,
        userId: number,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const ws = await this.create(
                createWorkspaceExtendedDto as CreateWorkspaceDto,
                transaction,
            );

            await transaction.commit();

            return await this.findOne(ws.id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findAll(userId: number, transaction?: Transaction) {
        try {
            return await this.workspaceRepository.findAndCountAll({
                // where: {
                //     $users$: { id: userId },
                // },
                attributes: this.attributes,
                include: [
                    {
                        model: User,
                        attributes: userTableAttributes,
                        where: {
                            id: userId,
                        },
                    },
                ],
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
            const candidate = await this.workspaceRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["name", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException(
                    "Рабочее пространство не найдено",
                );
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        updateWorkspaceDto: UpdateWorkspaceDto,
        transaction?: Transaction,
    ) {
        try {
            const candidate = await this.findOne(id, transaction);

            if (candidate) {
                return await this.workspaceRepository.update(
                    updateWorkspaceDto,
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
        updateWorkspaceExtendedDto: UpdateWorkspaceExtendedDto,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException(
                    "Рабочее пространство не найдено",
                );
            }

            await this.update(
                id,
                updateWorkspaceExtendedDto as UpdateWorkspaceDto,
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
                throw new BadRequestException(
                    "Рабочее пространство не найдено",
                );
            }

            return await this.workspaceRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
