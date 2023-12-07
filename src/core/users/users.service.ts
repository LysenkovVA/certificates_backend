import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcryptjs";
import { Transaction } from "sequelize";
import { File } from "../files/entities/file.entity";
import { Profile } from "../profiles/entities/profile.entity";
import { RolesService } from "../roles/roles.service";
import { Token } from "../tokens/entities/token.entity";
import { AddRoleDto } from "./dto/add-role.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user-dto";
import { User } from "./entity/users.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto, transaction?: Transaction) {
        if (!dto.email) {
            throw new BadRequestException("E-mail пользователя не указан!");
        }

        if (!dto.password) {
            throw new BadRequestException("Пароль пользователя не указан!");
        }

        const candidate = await this.getUserByEmail(dto.email, transaction);

        if (candidate) {
            throw new BadRequestException(
                `Пользователь c e-mail '${dto.email}' уже зарегистрирован!`,
            );
        }

        // Хешируем пароль
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
            include: [{ model: Profile, include: [File] }, Token],
            transaction,
        });
    }

    async getUserById(id: number, transaction?: Transaction) {
        return await this.userRepository.findByPk(id, {
            include: [{ model: Profile, include: [File] }, Token],
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

    async update(
        id: number,
        updateUserDto: UpdateUserDto,
        transaction?: Transaction,
    ) {
        const result = await this.userRepository.update(updateUserDto, {
            where: { id },
            transaction,
        });

        return Number(result[0]) > 0;
    }
}
