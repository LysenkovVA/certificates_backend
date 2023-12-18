import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcryptjs";
import { IncludeOptions, Transaction } from "sequelize";
import { File } from "../files/entities/file.entity";
import { Profile } from "../profiles/entities/profile.entity";
import { Role } from "../roles/entities/roles.entity";
import { RolesService } from "../roles/roles.service";
import { Subscription } from "../subscriptions/entities/subscription.entity";
import { Workspace } from "../workspaces/entities/workspace.entity";
import { AddRoleDto } from "./dto/add-role.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user-dto";
import { User } from "./entity/users.entity";

@Injectable()
export class UsersService {
    attributes: Array<string>;
    profileAttributes: Array<string>;
    roleAttributes: Array<string>;
    subscriptionAttributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
    ) {
        this.attributes = ["id", "email", "password"];
        this.profileAttributes = ["id", "surname", "name", "birthDate"];
        this.roleAttributes = ["id", "value"];
        this.subscriptionAttributes = ["id", "value"];

        this.include = [
            {
                model: Profile,
                attributes: this.profileAttributes,
                include: [File],
            },
            {
                model: Role,
                attributes: this.roleAttributes,
                through: { attributes: [] }, // Чтобы не показывалась промежуточная таблица
            },
            {
                model: Subscription,
                attributes: this.subscriptionAttributes,
                through: { attributes: [] }, // Чтобы не показывалась промежуточная таблица
            },
            {
                model: Workspace,
                through: { attributes: [] },
            },
        ];
    }

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
            attributes: this.attributes,
            include: this.include,
            transaction,
        });
    }

    async getUserById(id: number, transaction?: Transaction) {
        return await this.userRepository.findByPk(id, {
            attributes: this.attributes,
            include: this.include,
            transaction,
        });
    }

    async getAllUsers(transaction?: Transaction) {
        return await this.userRepository.findAll({
            attributes: this.attributes,
            include: this.include,
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
