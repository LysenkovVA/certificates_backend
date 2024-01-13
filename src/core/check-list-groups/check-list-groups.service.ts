import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateCheckListGroupDto } from "./dto/create-check-list-group.dto";
import { UpdateCheckListGroupDto } from "./dto/update-check-list-group.dto";
import { CheckListGroup } from "./entities/check-list-group.entity";

@Injectable()
export class CheckListGroupsService {
    constructor(
        @InjectModel(CheckListGroup)
        private checkListGroupsRepository: typeof CheckListGroup,
    ) {}

    async create(
        createCheckListGroupDto: CreateCheckListGroupDto,
        transaction?: Transaction,
    ) {
        return await this.checkListGroupsRepository.create(
            createCheckListGroupDto,
            { transaction },
        );
    }

    async update(
        id: number,
        updateCheckListGroupDto: UpdateCheckListGroupDto,
        transaction?: Transaction,
    ) {
        return await this.checkListGroupsRepository.update(
            updateCheckListGroupDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.checkListGroupsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
