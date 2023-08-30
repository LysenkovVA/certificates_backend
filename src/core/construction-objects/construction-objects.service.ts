import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateConstructionObjectDto } from "./dto/create-construction-object.dto";
import { UpdateConstructionObjectDto } from "./dto/update-construction-object.dto";
import { ConstructionObject } from "./entities/construction-object.entity";

@Injectable()
export class ConstructionObjectsService {
    constructor(
        @InjectModel(ConstructionObject)
        private constructionObjectsRepository: typeof ConstructionObject,
    ) {}

    async create(
        createConstructionObjectDto: CreateConstructionObjectDto,
        transaction?: Transaction,
    ) {
        return await this.constructionObjectsRepository.create(
            createConstructionObjectDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.constructionObjectsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.constructionObjectsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateConstructionObjectDto: UpdateConstructionObjectDto,
        transaction?: Transaction,
    ) {
        return await this.constructionObjectsRepository.update(
            updateConstructionObjectDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.constructionObjectsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
