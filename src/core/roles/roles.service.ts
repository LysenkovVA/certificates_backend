import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { roleTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/roles.entity";
import { RoleTypes } from "./types/RoleTypes";

@Injectable()
export class RolesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {
        this.attributes = roleTableAttributes;
    }

    async createRole(dto: CreateRoleDto, transaction?: Transaction) {
        const candidate = await this.getRoleByValue(dto.value, transaction);

        if (candidate) {
            throw new HttpException(
                `Роль ${dto.value} уже существует!`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.roleRepository.create(dto, { transaction });
    }

    async getRoleByValue(value: RoleTypes | string, transaction?: Transaction) {
        return await this.roleRepository.findOne({
            where: { value },
            transaction,
        });
    }

    async getAllRoles(transaction?: Transaction) {
        return await this.roleRepository.findAll({
            // include: { all: true },
            transaction,
        });
    }
}
