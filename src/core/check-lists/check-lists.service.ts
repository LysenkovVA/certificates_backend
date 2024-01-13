import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    checkListGroupTableAttributes,
    checkListTableAttributes,
    checkTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import {
    ConsoleColor,
    ConsoleLogger,
} from "../../infrastructure/helpers/ConsoleLogger";
import { CheckListGroupsService } from "../check-list-groups/check-list-groups.service";
import { CreateCheckListGroupDto } from "../check-list-groups/dto/create-check-list-group.dto";
import { CheckListGroup } from "../check-list-groups/entities/check-list-group.entity";
import { ChecksService } from "../checks/checks.service";
import { CreateCheckDto } from "../checks/dto/create-check.dto";
import { Check } from "../checks/entities/check.entity";
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
        private checkListGroupService: CheckListGroupsService,
        private checkService: ChecksService,
    ) {
        // Параметры запросов к БД
        this.attributes = checkListTableAttributes;
        this.include = [
            { model: Workspace, attributes: workspaceTableAttributes },
            {
                model: CheckListGroup,
                attributes: checkListGroupTableAttributes,
                include: [{ model: Check, attributes: checkTableAttributes }],
            },
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
        ConsoleLogger.PrintMessage(
            JSON.stringify(createCheckListExtendedDto),
            ConsoleColor.GREEN,
        );

        const transaction = await this.sequelize.transaction();

        try {
            const item = await this.create(
                createCheckListExtendedDto as CreateCheckListDto,
                transaction,
            );

            await item.$set("workspace", [workspaceId], {
                transaction,
            });

            if (createCheckListExtendedDto.checkListGroups) {
                let groupPosition = 0;
                for (const checkListGroup of createCheckListExtendedDto.checkListGroups) {
                    const newCheckListGroup =
                        await this.checkListGroupService.create(
                            {
                                ...(checkListGroup as CreateCheckListGroupDto),
                                position: groupPosition,
                            },
                            transaction,
                        );

                    await item.$add("checkListGroups", [newCheckListGroup.id], {
                        transaction,
                    });

                    if (checkListGroup.checks) {
                        let checkPosition = 0;
                        for (const check of checkListGroup.checks) {
                            const newCheck = await this.checkService.create(
                                {
                                    ...(check as CreateCheckDto),
                                    position: checkPosition,
                                },
                                transaction,
                            );

                            await newCheckListGroup.$add(
                                "checks",
                                [newCheck.id],
                                {
                                    transaction,
                                },
                            );

                            checkPosition++;
                        }
                    }

                    groupPosition++;
                }
            }

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

            // Удаляем старое
            for (const group of candidate.checkListGroups) {
                await this.checkListGroupService.remove(group.id, transaction);
            }

            // Создаем новое
            for (const checkListGroup of updateCheckListExtendedDto.checkListGroups) {
                const newCheckListGroup =
                    await this.checkListGroupService.create(
                        checkListGroup as CreateCheckListGroupDto,
                        transaction,
                    );

                await candidate.$add(
                    "checkListGroups",
                    [newCheckListGroup.id],
                    {
                        transaction,
                    },
                );

                for (const check of checkListGroup.checks) {
                    const newCheck = await this.checkService.create(
                        check as CreateCheckDto,
                        transaction,
                    );

                    await newCheckListGroup.$add("checks", [newCheck.id], {
                        transaction,
                    });
                }
            }

            // // Удаляем группы, которые больше не связаны со списком
            // for (const group of candidate.checkListGroups) {
            //     // Ищем группу, которую нужно обновить
            //     const groupsDto =
            //         updateCheckListExtendedDto.checkListGroups.filter(
            //             (groupDto) => groupDto.id === group.id,
            //         );
            //
            //     // Группа не найдена, значит ее надо удалить
            //     if (!groupsDto || groupsDto.length === 0) {
            //         // Удаляем группу
            //         await this.checkListGroupService.remove(
            //             group.id,
            //             transaction,
            //         );
            //     } else {
            //         // Группа найдена
            //         for (const groupDto of groupsDto) {
            //             await this.checkListGroupService.update(
            //                 groupDto.id,
            //                 groupDto as UpdateCheckListGroupDto,
            //                 transaction,
            //             );
            //
            //             // Ищем проверки
            //             for (const checkDto of groupDto.checks) {
            //                 // Ищем проверку, которую нужно обновить
            //                 const checksDto =
            //                   groupDto.checks.filter(
            //                     (checkDto) => checkDto.id === checkDto.id,
            //                   );
            //             }
            //         }
            //     }
            // }
            //
            // for (const checkListGroup of updateCheckListExtendedDto.checkListGroups) {
            //     // Создаем новые группы
            //     if (!checkListGroup.id) {
            //         const newCheckListGroup =
            //             await this.checkListGroupService.create(
            //                 checkListGroup as CreateCheckListGroupDto,
            //                 transaction,
            //             );
            //
            //         await candidate.$add(
            //             "checkListGroups",
            //             [newCheckListGroup.id],
            //             {
            //                 transaction,
            //             },
            //         );
            //
            //         for (const check of checkListGroup.checks) {
            //             const newCheck = await this.checkService.create(
            //                 check as CreateCheckDto,
            //                 transaction,
            //             );
            //
            //             await newCheckListGroup.$add("checks", [newCheck.id], {
            //                 transaction,
            //             });
            //         }
            //     } else {
            //         // Обновление
            //     }
            // }

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
