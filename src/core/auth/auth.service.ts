import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { ValidationError } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Dates } from "../../infrastructure/helpers/Dates";
import { ProfilesService } from "../profiles/profiles.service";
import { RolesService } from "../roles/roles.service";
import { RoleTypes } from "../roles/types/RoleTypes";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { SubscriptionType } from "../subscriptions/types/SubscriptionType";
import { TokensService } from "../tokens/tokens.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
import { WorkspacesService } from "../workspaces/workspaces.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private userService: UsersService,
        private roleService: RolesService,
        private subscriptionService: SubscriptionsService,
        private sequelize: Sequelize,
        private jwtService: JwtService,
        private tokenService: TokensService,
        private profileService: ProfilesService,
        private workspaceService: WorkspacesService,
    ) {}

    /**
     * Регистрация пользователя
     * @param createUserDto
     */
    async register(createUserDto: CreateUserDto) {
        console.log("Searching candidate...");
        const candidate = await this.userService.getUserByEmail(
            createUserDto.email,
        );

        if (candidate) {
            console.log("Candidate exists!");
            throw new BadRequestException({
                message: `Пользователь с e-mail ${createUserDto.email} уже зарегистрирован!`,
            });
        }

        // Запускаем транзакцию
        const transaction = await this.sequelize.transaction();

        try {
            // Создаем нового пользователя
            console.log("Creating user...");
            const user = await this.userService.createUser(
                createUserDto,
                transaction,
            );

            console.log("Adding role...");
            // Добавляем роль пользователя
            const userRole = await this.roleService.getRoleByValue(
                RoleTypes.USER,
                transaction,
            );

            if (!userRole) {
                console.log("Role not found...");
                throw new InternalServerErrorException(
                    `Роль ${RoleTypes.USER} отсутствует в системе!`,
                );
            }

            console.log("Add role to user...");
            await user.$add("roles", [userRole.id], { transaction });

            // Добавляем подписку
            console.log("Adding subscription...");
            const freeSubscription =
                await this.subscriptionService.findSubscriptionByValue(
                    SubscriptionType.FREE,
                );

            if (!freeSubscription) {
                console.log("Subscription not found!");
                throw new InternalServerErrorException(
                    `Подписка ${SubscriptionType.FREE} отсутствует в системе!`,
                );
            }

            console.log("Adding subscription to user...");
            await user.$add("subscriptions", [freeSubscription.id], {
                transaction,
                through: {
                    startDate: new Date(),
                    endDate: Dates.getDateFrom(new Date(), 1),
                },
            });

            // Добавляем рабочее пространство
            console.log("Creating user workspace...");
            const workSpace = await this.workspaceService.create({
                name: "Моя организация",
            });

            if (workSpace) {
                console.log("Adding workspace to user...");
                await user.$add("workspaces", [workSpace.id], { transaction });
            }

            // Создаем профиль пользователя
            console.log("Creating profile...");
            const profile = await this.profileService.create(
                { surname: null, name: null, birthDate: null },
                transaction,
            );

            if (profile) {
                console.log("Adding profile to user...");
                await user.$set("profile", [profile.id], { transaction });
            }

            // TODO - Отправка подтверждения на email

            // Генерируем токены
            console.log("Generate tokens...");
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            // Создаем токен и добавляем пользователю
            console.log("Creating refresh token...");
            const token = await this.tokenService.create(
                { refreshToken },
                transaction,
            );

            console.log("Add refresh token to user...");
            await user.$add("tokens", [token.id], {
                transaction,
            });

            // Коммит
            await transaction.commit();

            console.log("Getting user by id...");
            const createdUser = await this.userService.getUserById(user.id);

            return {
                user: {
                    id: createdUser.id,
                    email: createdUser.email,
                    profile: createdUser.profile,
                    roles: createdUser.roles,
                    subscriptions: createdUser.subscriptions,
                    workspaces: createdUser.workspaces,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof ValidationError) {
                throw new InternalServerErrorException(error.errors);
            }

            throw new InternalServerErrorException(error);
        }
    }

    /**
     * Авторизация
     * @param loginDto
     */
    async login(loginDto: LoginDto) {
        // Запускаем транзакцию
        const transaction = await this.sequelize.transaction();

        try {
            // Ищем пользователя и проверяем правильность пароля
            const user = await this.userService.getUserByEmail(
                loginDto.email,
                transaction,
            );

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

            // Пользователь логинится в первый раз и у него еще нет
            // профиля
            if (!user.profile) {
                // Создаем профиль пользователя
                const profile = await this.profileService.create(
                    { surname: null, name: null, birthDate: null },
                    transaction,
                );

                if (profile) {
                    // ОБЯЗАТЕЛЬНО ПЕРЕДАВАТЬ id, а не объект
                    await user.$set("profile", [profile.id], { transaction });
                }
            }

            // Генерируем токены
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            // Обновляем refresh токен
            if (user.tokens?.length > 0) {
                await this.tokenService.update(
                    user.tokens[0].id,
                    { refreshToken },
                    transaction,
                );
            } else {
                // Пользователь логинится в первый раз или токена нет
                const token = await this.tokenService.create(
                    { refreshToken },
                    transaction,
                );
                await user.$add("tokens", [token.id], { transaction });
            }

            // Коммит
            await transaction.commit();

            const loggedInUser = await this.userService.getUserById(user.id);

            return {
                user: {
                    id: loggedInUser.id,
                    email: loggedInUser.email,
                    profile: loggedInUser.profile,
                    roles: loggedInUser.roles,
                    subscriptions: loggedInUser.subscriptions,
                    workspaces: loggedInUser.workspaces,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof ValidationError) {
                throw new InternalServerErrorException(error.errors);
            }

            throw new InternalServerErrorException(error);
        }
    }

    /**
     * Выход из приложения
     * @param refreshToken
     */
    async logout(refreshToken: string) {
        try {
            const token =
                await this.tokenService.findRefreshToken(refreshToken);

            if (token) {
                await this.tokenService.remove(token.id);
            }

            return true;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new InternalServerErrorException(error.errors);
            }

            throw new InternalServerErrorException(error);
        }
    }

    async refresh(refreshToken: string) {
        try {
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
                        profile: user.profile,
                        roles: user.roles,
                        subscriptions: user.subscriptions,
                        workspaces: user.workspaces,
                    },
                    accessToken,
                    refreshToken,
                };
            }
        } catch (e) {
            throw new InternalServerErrorException(e);
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
