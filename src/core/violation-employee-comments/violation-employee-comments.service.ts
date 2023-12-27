import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { violationEmployeeCommentTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateViolationEmployeeCommentDto } from "./dto/create-violation-employee-comment.dto";
import { UpdateViolationEmployeeCommentDto } from "./dto/update-violation-employee-comment.dto";
import { ViolationEmployeeComment } from "./entities/violation-employee-comment.entity";

@Injectable()
export class ViolationEmployeeCommentsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(ViolationEmployeeComment)
        private violationEmployeeCommentsRepository: typeof ViolationEmployeeComment,
    ) {
        this.attributes = violationEmployeeCommentTableAttributes;
    }

    async create(
        createViolationEmployeeCommentDto: CreateViolationEmployeeCommentDto,
        transaction?: Transaction,
    ) {
        return await this.violationEmployeeCommentsRepository.create(
            createViolationEmployeeCommentDto,
            { transaction },
        );
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return await this.violationEmployeeCommentsRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.violationEmployeeCommentsRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateViolationEmployeeCommentDto: UpdateViolationEmployeeCommentDto,
        transaction?: Transaction,
    ) {
        return await this.violationEmployeeCommentsRepository.update(
            updateViolationEmployeeCommentDto,
            { where: { id }, transaction },
        );
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.violationEmployeeCommentsRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
