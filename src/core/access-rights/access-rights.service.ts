import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateAccessRightDto } from "./dto/create-access-right.dto";
import { UpdateAccessRightDto } from "./dto/update-access-right.dto";
import { AccessRight } from "./entities/access-right.entity";

@Injectable()
export class AccessRightsService {
    constructor(
        @InjectModel(AccessRight)
        private accessRightsRepository: typeof AccessRight,
    ) {}
    async create(
        createAccessRightDto: CreateAccessRightDto,
        transaction?: Transaction,
    ) {
        return await this.accessRightsRepository.create(createAccessRightDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.accessRightsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.accessRightsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateAccessRightDto: UpdateAccessRightDto,
        transaction?: Transaction,
    ) {
        return await this.accessRightsRepository.update(updateAccessRightDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.accessRightsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
