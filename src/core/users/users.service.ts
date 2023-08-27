import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcryptjs";
import { Transaction } from "sequelize";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/users.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto, transaction?: Transaction) {
        if (!dto.email) {
            throw new HttpException(
                "Email пользователя не задан!",
                HttpStatus.BAD_REQUEST,
                { description: "Ошибка при создании пользователя" },
            );
        }

        if (!dto.password) {
            throw new HttpException(
                "Пароль пользователя не задан!",
                HttpStatus.BAD_REQUEST,
                { description: "Ошибка при создании пользователя" },
            );
        }

        const candidate = await this.getUserByEmail(dto.email, transaction);

        if (candidate) {
            throw new HttpException(
                `Пользователь ${dto.email} уже зарегистрирован!`,
                HttpStatus.BAD_REQUEST,
                { description: "Ошибка при создании пользователя" },
            );
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);

        return await this.userRepository.create(
            { ...dto, password: hashPassword },
            { transaction },
        );
    }

    async getUserByEmail(email: string, transaction?: Transaction) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            include: { all: true },
            transaction,
        });
    }

    async getAllUsers(transaction?: Transaction) {
        return await this.userRepository.findAll({
            include: { all: true },
            transaction,
        });
    }

    async addRole(dto: AddRoleDto, transaction?: Transaction) {
        const user = await this.userRepository.findByPk(dto.userId, {
            transaction,
        });
        const role = await this.roleService.getRoleByValue(
            dto.value,
            transaction,
        );

        if (user && role) {
            await user.$add("role", role.id, { transaction });
            return dto;
        }

        throw new HttpException(
            "Пользователь или роль не найдены",
            HttpStatus.NOT_FOUND,
        );
    }
}
