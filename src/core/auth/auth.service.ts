import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Sequelize } from "sequelize-typescript";
import { ProfilesService } from "../profiles/profiles.service";
import { RolesService } from "../roles/roles.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { TeamsService } from "../teams/teams.service";
import { TokensService } from "../tokens/tokens.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private userService: UsersService,
        private roleService: RolesService,
        private subscriptionService: SubscriptionsService,
        private teamsService: TeamsService,
        private sequelize: Sequelize,
        private jwtService: JwtService,
        private tokenService: TokensService,
        private profileService: ProfilesService,
    ) {}

    /**
     * Регистрация пользователя
     * @param createUserDto
     * @param userType
     */
    async register(createUserDto: CreateUserDto, userType: string) {
        // Проверка существования роли в запросе
        if (!userType) {
            throw new BadRequestException(
                `Тип пользователя не задан (параметр 'type')`,
            );
        }

        const candidate = await this.userService.getUserByEmail(
            createUserDto.email,
        );

        if (candidate) {
            throw new BadRequestException({
                message: `Пользователь с e-mail ${createUserDto.email} уже зарегистрирован!`,
            });
        }

        // // Ищем роль в БД
        const role = await this.roleService.getRoleByValue(
            userType.toUpperCase(),
        );

        if (!role) {
            throw new InternalServerErrorException(
                `Роль '${userType} отсутствует в системе!'`,
            );
        }

        const userRole = await this.roleService.getRoleByValue("USER");

        if (!userRole) {
            throw new InternalServerErrorException(
                `Роль USER отсутствует в системе!`,
            );
        }

        const basicSubscription =
            await this.subscriptionService.findSubscriptionByValue("Free");
        if (!basicSubscription) {
            throw new InternalServerErrorException(
                `Подписка Free отсутствует в системе!`,
            );
        }

        const transaction = await this.sequelize.transaction();

        try {
            // Создаем нового пользователя
            const user = await this.userService.createUser(
                createUserDto,
                transaction,
            );

            const profile = await this.profileService.create(
                { surname: null, name: null, birthDate: null },
                transaction,
            );

            if (profile) {
                // ОБЯЗАТЕЛЬНО ПЕРЕДАВАТЬ id, а не объект
                await user.$set("profile", [profile.id], { transaction });
            }

            // // Добавляем роль при регистрации
            // if (role.value === "ADMIN") {
            //     await user.$add("roles", [role.id], { transaction });
            // } else {
            //     // Добавляем роль пользователя
            //     await user.$add("roles", [userRole.id], { transaction });
            //
            //     // Добавляем подписку
            //     await user.$add("subscriptions", [basicSubscription.id], {
            //         transaction,
            //         through: {
            //             startDate: new Date(),
            //             endDate: Dates.getDateFrom(new Date(), 1),
            //         },
            //     });
            // }

            // Генерируем токены
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            // Создаем токен и добавляем пользователю
            const token = await this.tokenService.create(
                { refreshToken },
                transaction,
            );
            await user.$add("tokens", [token], {
                transaction,
            });

            // Коммит
            await transaction.commit();

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    profile: user.profile,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Авторизация
     * @param loginDto
     */
    async login(loginDto: LoginDto) {
        // Ищем пользователя и проверяем правильность пароля
        const user = await this.userService.getUserByEmail(loginDto.email);

        if (!user) {
            throw new BadRequestException({
                message: `Пользователь с e-mail '${loginDto.email}' не существует!`,
            });
        }

        // Здесь await нужен, иначе не срабатывает!
        // .then нужен чтобы среда не подсвечивала синтаксис
        const passwordEquals = await bcrypt
            .compare(loginDto.password, user.password)
            .then((resolve) => resolve);

        if (!passwordEquals) {
            throw new BadRequestException({
                message: `Неверный пароль!`,
            });
        }

        // Генерируем токены
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);

        // Обновляем refresh токен
        if (user.tokens.length > 0) {
            await this.tokenService.update(user.tokens[0].id, { refreshToken });
        } else {
            // Пользователь логинится в первый раз или токена нет
            const token = await this.tokenService.create({ refreshToken });
            await user.$add("tokens", [token]);
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                profile: user.profile,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Выход из приложения
     * @param refreshToken
     */
    async logout(refreshToken: string) {
        const token = await this.tokenService.findRefreshToken(refreshToken);

        if (token) {
            await this.tokenService.remove(token.id);
        }

        return true;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException("Токен не найден!");
        }

        // Валидация
        const payload = await this.verifyRefreshToken(refreshToken);

        // Поиск в БД
        const token = this.tokenService.findRefreshToken(refreshToken);

        if (!payload || !token) {
            throw new UnauthorizedException("Ошибка верификации токена!");
        }

        // Получаем email пользователя
        const { id } = payload;

        if (id) {
            // Получаем пользователя из БД с актуальными данными
            const user = await this.userService.getUserById(id);

            if (!user) {
                throw new InternalServerErrorException(
                    "Ошибка при получении пользователя!",
                );
            }

            // Генерируем access токен
            const accessToken = await this.generateAccessToken(user);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                },
                accessToken,
                refreshToken,
            };
        }
    }

    private async generateAccessToken(user: User) {
        const payload = { id: user.id, email: user.email, roles: user.roles };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_KEY"),
            expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_TTL"),
        });
    }

    private async generateRefreshToken(user: User) {
        const payload = { id: user.id, email: user.email, roles: user.roles };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_KEY"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_TTL"),
        });
    }

    private async verifyAccessToken(accessToken: string) {
        try {
            return this.jwtService.verify(accessToken, {
                secret: this.configService.get<string>("JWT_ACCESS_TOKEN_KEY"),
            });
        } catch {
            return null;
        }
    }

    private async verifyRefreshToken(refreshToken: string) {
        try {
            return this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_KEY"),
            });
        } catch {
            return null;
        }
    }
}
