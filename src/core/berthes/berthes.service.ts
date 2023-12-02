import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { BerthType } from "../berth-types/entities/berth-type.entity";
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

    async findAll(
        // limit: number,
        // offset: number,
        // searchQuery?: string,
        transaction?: Transaction,
    ) {
        return await this.berthRepository.findAndCountAll({
            // limit,
            // offset,
            // where: {
            //     value: {
            //         [Op.iLike]: `%${searchQuery}%`,
            //     },
            // },
            transaction,
            include: [{ model: BerthType }],
            distinct: true,
            order: [["value", "ASC"]],
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.berthRepository.findOne({
            where: { id },
            include: [{ model: BerthType }],
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
