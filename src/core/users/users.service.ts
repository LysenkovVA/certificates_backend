import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import {
    fileTableAttributes,
    profileTableAttributes,
    roleTableAttributes,
    subscriptionTableAttributes,
    userTableAttributes,
    workspaceTableAttributes,
} from "../../infrastructure/const/tableAttributes";
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
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
    ) {
        this.attributes = userTableAttributes;

        this.include = [
            {
                model: Profile,
                attributes: profileTableAttributes,
                include: [{ model: File, attributes: fileTableAttributes }],
            },
            {
                model: Role,
                attributes: roleTableAttributes,
                through: { attributes: [] }, // Чтобы не показывалась промежуточная таблица
            },
            {
                model: Subscription,
                attributes: subscriptionTableAttributes,
                through: { attributes: [] }, // Чтобы не показывалась промежуточная таблица
            },
            {
                model: Workspace,
                attributes: workspaceTableAttributes,
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

        // const candidate = await this.getUserByEmail(dto.email, transaction);
        //
        // if (candidate) {
        //     throw new BadRequestException(
        //         `Пользователь c e-mail '${dto.email}' уже зарегистрирован!`,
        //     );
        // }

        return await this.userRepository.create(dto, { transaction });
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
