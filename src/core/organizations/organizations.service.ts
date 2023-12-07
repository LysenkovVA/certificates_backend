import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { Organization } from "./entities/organization.entity";

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectModel(Organization)
        private organizationRepository: typeof Organization,
    ) {}

    async create(
        createOrganizationDto: CreateOrganizationDto,
        transaction?: Transaction,
    ) {
        return await this.organizationRepository.create(createOrganizationDto, {
            transaction,
        });
    }

    async findAll(limit?: number, offset?: number, transaction?: Transaction) {
        if (!limit || !offset) {
            return await this.organizationRepository.findAndCountAll({
                transaction,
            });
        } else {
            return await this.organizationRepository.findAndCountAll({
                limit,
                offset,
                transaction,
            });
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.organizationRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateOrganizationDto: UpdateOrganizationDto,
        transaction?: Transaction,
    ) {
        return await this.organizationRepository.update(updateOrganizationDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.organizationRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
