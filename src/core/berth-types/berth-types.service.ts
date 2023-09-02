import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateBerthTypeDto } from "./dto/create-berth-type.dto";
import { UpdateBerthTypeDto } from "./dto/update-berth-type.dto";
import { BerthType } from "./entities/berth-type.entity";

@Injectable()
export class BerthTypesService {
    constructor(
        @InjectModel(BerthType) private berthTypeRepository: typeof BerthType,
    ) {}

    async create(
        createBerthTypeDto: CreateBerthTypeDto,
        transaction?: Transaction,
    ) {
        return await this.berthTypeRepository.create(createBerthTypeDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.berthTypeRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.berthTypeRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateBerthTypeDto: UpdateBerthTypeDto,
        transaction?: Transaction,
    ) {
        return await this.berthTypeRepository.update(updateBerthTypeDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.berthTypeRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
