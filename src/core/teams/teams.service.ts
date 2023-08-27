import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { Team } from "./entities/team.entity";

@Injectable()
export class TeamsService {
    constructor(@InjectModel(Team) private teamRepository: typeof Team) {}

    async create(createTeamDto: CreateTeamDto, transaction?: Transaction) {
        if (!createTeamDto.value) {
            throw new HttpException(
                "Не задано имя команды!",
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.teamRepository.create(createTeamDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.teamRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.teamRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateTeamDto: UpdateTeamDto,
        transaction?: Transaction,
    ) {
        return await this.teamRepository.update(updateTeamDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.teamRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
