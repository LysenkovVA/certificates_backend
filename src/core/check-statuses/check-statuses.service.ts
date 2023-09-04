import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateCheckStatusDto } from "./dto/create-check-status.dto";
import { UpdateCheckStatusDto } from "./dto/update-check-status.dto";
import { CheckStatus } from "./entities/check-status.entity";

@Injectable()
export class CheckStatusesService {
    constructor(
        @InjectModel(CheckStatus)
        private checkStatusRepository: typeof CheckStatus,
    ) {}

    async create(
        createCheckStatusDto: CreateCheckStatusDto,
        transaction?: Transaction,
    ) {
        return await this.checkStatusRepository.create(createCheckStatusDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.checkStatusRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.checkStatusRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateCheckStatusDto: UpdateCheckStatusDto,
        transaction?: Transaction,
    ) {
        return await this.checkStatusRepository.update(updateCheckStatusDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.checkStatusRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
