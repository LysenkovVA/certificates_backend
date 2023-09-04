import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateViolationCommentDto } from "./dto/create-violation-comment.dto";
import { UpdateViolationCommentDto } from "./dto/update-violation-comment.dto";
import { ViolationComment } from "./entities/violation-comment.entity";

@Injectable()
export class ViolationCommentsService {
    constructor(
        @InjectModel(ViolationComment)
        private violationCommentsRepository: typeof ViolationComment,
    ) {}

    async create(
        createViolationCommentDto: CreateViolationCommentDto,
        transaction?: Transaction,
    ) {
        return await this.violationCommentsRepository.create(
            createViolationCommentDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.violationCommentsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.violationCommentsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateViolationCommentDto: UpdateViolationCommentDto,
        transaction?: Transaction,
    ) {
        return await this.violationCommentsRepository.update(
            updateViolationCommentDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.violationCommentsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
