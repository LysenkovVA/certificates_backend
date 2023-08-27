import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Sequelize } from "sequelize-typescript";
import { Dates } from "../../infrastructure/helpers/Dates";
import { RolesService } from "../roles/roles.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { TeamsService } from "../teams/teams.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private roleService: RolesService,
        private subscriptionService: SubscriptionsService,
        private teamsService: TeamsService,
        private sequelize: Sequelize,
        private jwtService: JwtService,
    ) {}
    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = { id: user.id, email: user.email, roles: user.roles };

        return { token: this.jwtService.sign(payload) };
    }

    async register(createUserDto: CreateUserDto, userType: string) {
        // Проверка существования роли в запросе
        if (!userType) {
            throw new HttpException(
                `Тип пользователя не задан (параметр 'type')`,
                HttpStatus.BAD_REQUEST,
                { description: "Ошибка при регистрации пользователя!" },
            );
        }

        // Ищем роль в БД
        const role = await this.roleService.getRoleByValue(
            userType.toUpperCase(),
        );

        if (!role) {
            throw new HttpException(
                `Роль '${userType} не существует!'`,
                HttpStatus.BAD_REQUEST,
                { description: "Ошибка при регистрации пользователя!" },
            );
        }

        const userRole = await this.roleService.getRoleByValue("USER");

        if (!userRole) {
            throw new HttpException(
                `Роль USER отсутствует в системе!`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const basicSubscription =
            await this.subscriptionService.findSubscriptionByValue("Free");
        if (!basicSubscription) {
            throw new HttpException(
                `Подписка Free отсутствует в системе!`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const transaction = await this.sequelize.transaction();

        try {
            // Создаем нового пользователя
            const user = await this.userService.createUser(
                createUserDto,
                transaction,
            );

            // Добавляем роль при регистрации
            if (role.value === "ADMIN") {
                await user.$add("roles", [role.id], { transaction });
            } else {
                // Добавляем роль пользователя
                await user.$add("roles", [userRole.id], { transaction });

                // Добавляем подписку
                await user.$add("subscriptions", [basicSubscription.id], {
                    transaction,
                    through: {
                        startDate: new Date(),
                        endDate: Dates.getDateFrom(new Date(), 1),
                    },
                });

                // Добавляем команду
                const team = await this.teamsService.create(
                    {
                        value: "Моя команда",
                        description: "Описание команды",
                    },
                    transaction,
                );

                if (!team) {
                    throw new HttpException(
                        `Команда не создана!`,
                        HttpStatus.BAD_REQUEST,
                    );
                }

                console.log(team);

                await user.$add("teams", [team.id], {
                    transaction,
                    through: {
                        roleId: userRole.id,
                    },
                });
            }

            // Коммит
            await transaction.commit();

            // Возвращаем токен
            return await this.generateToken(user);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    private async validateUser(loginDto: LoginDto) {
        const user = await this.userService.getUserByEmail(loginDto.email);
        const passwordEquals = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({
            message: "Некорректный email или пароль",
        });
    }
}
