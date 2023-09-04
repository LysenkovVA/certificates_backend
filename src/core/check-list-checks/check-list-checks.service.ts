import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateCheckListCheckDto } from "./dto/create-check-list-check.dto";
import { UpdateCheckListCheckDto } from "./dto/update-check-list-check.dto";
import { CheckListCheck } from "./entities/check-list-check.entity";

@Injectable()
export class CheckListChecksService {
    constructor(
        @InjectModel(CheckListCheck)
        private checkListChecksRepository: typeof CheckListCheck,
    ) {}

    async create(
        createCheckListCheckDto: CreateCheckListCheckDto,
        transaction?: Transaction,
    ) {
        return await this.checkListChecksRepository.create(
            createCheckListCheckDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.checkListChecksRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.checkListChecksRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateCheckListCheckDto: UpdateCheckListCheckDto,
        transaction?: Transaction,
    ) {
        return await this.checkListChecksRepository.update(
            updateCheckListCheckDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.checkListChecksRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
