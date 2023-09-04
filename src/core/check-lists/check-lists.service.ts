import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateCheckListDto } from "./dto/create-check-list.dto";
import { UpdateCheckListDto } from "./dto/update-check-list.dto";
import { CheckList } from "./entities/check-list.entity";

@Injectable()
export class CheckListsService {
    constructor(
        @InjectModel(CheckList) private checkListsRepository: typeof CheckList,
    ) {}

    async create(
        createCheckListDto: CreateCheckListDto,
        transaction?: Transaction,
    ) {
        return await this.checkListsRepository.create(createCheckListDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.checkListsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.checkListsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateCheckListDto: UpdateCheckListDto,
        transaction?: Transaction,
    ) {
        return await this.checkListsRepository.update(updateCheckListDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.checkListsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
