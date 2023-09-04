import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateCheckDto } from "./dto/create-check.dto";
import { UpdateCheckDto } from "./dto/update-check.dto";
import { Check } from "./entities/check.entity";

@Injectable()
export class ChecksService {
    constructor(@InjectModel(Check) private checksRepository: typeof Check) {}

    async create(createCheckDto: CreateCheckDto, transaction?: Transaction) {
        return await this.checksRepository.create(createCheckDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.checksRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.checksRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateCheckDto: UpdateCheckDto,
        transaction?: Transaction,
    ) {
        return await this.checksRepository.update(updateCheckDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.checksRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
