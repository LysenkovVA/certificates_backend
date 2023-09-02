import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateBerthDto } from "./dto/create-berth.dto";
import { UpdateBerthDto } from "./dto/update-berth.dto";
import { Berth } from "./entities/berth.entity";

@Injectable()
export class BerthesService {
    constructor(@InjectModel(Berth) private berthRepository: typeof Berth) {}

    async create(createBertheDto: CreateBerthDto, transaction?: Transaction) {
        return await this.berthRepository.create(createBertheDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.berthRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.berthRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateBertheDto: UpdateBerthDto,
        transaction?: Transaction,
    ) {
        return await this.berthRepository.update(updateBertheDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.berthRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
