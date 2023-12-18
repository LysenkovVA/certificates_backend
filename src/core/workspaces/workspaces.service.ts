import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { Workspace } from "./entities/workspace.entity";

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectModel(Workspace) private workspaceRepository: typeof Workspace,
    ) {}

    async create(
        createWorkspaceDto: CreateWorkspaceDto,
        transaction?: Transaction,
    ) {
        return await this.workspaceRepository.create(createWorkspaceDto, {
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.workspaceRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        id: number,
        updateWorkspaceDto: UpdateWorkspaceDto,
        transaction?: Transaction,
    ) {
        return await this.workspaceRepository.update(updateWorkspaceDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.workspaceRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
