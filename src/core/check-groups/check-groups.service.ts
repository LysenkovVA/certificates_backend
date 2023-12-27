import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { checkGroupsTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateCheckGroupDto } from "./dto/create-check-group.dto";
import { UpdateCheckGroupDto } from "./dto/update-check-group.dto";
import { CheckGroup } from "./entities/check-group.entity";

@Injectable()
export class CheckGroupsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(CheckGroup)
        private checkGroupsRepository: typeof CheckGroup,
    ) {
        this.attributes = checkGroupsTableAttributes;
    }

    async create(
        createCheckGroupDto: CreateCheckGroupDto,
        transaction?: Transaction,
    ) {
        return await this.checkGroupsRepository.create(createCheckGroupDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.checkGroupsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.checkGroupsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateCheckGroupDto: UpdateCheckGroupDto,
        transaction?: Transaction,
    ) {
        return await this.checkGroupsRepository.update(updateCheckGroupDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.checkGroupsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
