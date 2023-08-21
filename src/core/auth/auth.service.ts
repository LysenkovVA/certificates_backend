import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Sequelize } from "sequelize-typescript";
import { RolesService } from "../roles/roles.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private roleService: RolesService,
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
        const transaction = await this.sequelize.transaction();

        try {
            // Проверка существования роли в запросе
            if (!userType) {
                throw new HttpException(
                    `Тип пользователя не задан (параметр 'type')`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Ищем роль в БД
            const role = await this.roleService.getRoleByValue(
                userType.toUpperCase(),
                transaction,
            );

            if (!role) {
                throw new HttpException(
                    `Роль '${userType} не существует!'`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Если пользователь регистрируется как владелец УЦ,
            // проверяем указано ли имя учебного центра в запросе
            if (
                role.value === "STUDY_CENTER_OWNER" &&
                !createUserDto.studyCenterName
            ) {
                throw new HttpException(
                    `Не указано имя учебного центра`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Если пользователь регистрируется как владелец УЦ,
            // проверяем указано ли имя учебного центра в запросе
            if (
                role.value === "STUDY_CENTER_MANAGER" &&
                !createUserDto.studyCenterId
            ) {
                throw new HttpException(
                    `Не указан идентификатор учебного центра`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Проверка существования пользователя в системе
            const candidate = await this.userService.getUserByEmail(
                createUserDto.email,
                transaction,
            );

            if (candidate) {
                throw new HttpException(
                    `Пользователь ${createUserDto.email} уже зарегистрирован`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Создаем нового пользователя
            const user = await this.userService.createUser(
                createUserDto,
                transaction,
            );
            // Добавляем роль при регистрации
            //await user.$set("roles", [role.id], { transaction });
            await user.$add("roles", [role.id], { transaction });

            // Если роль не USER и не ADMIN, добавляем еще и ее
            if (role.value !== "USER" && role.value !== "ADMIN") {
                const userRole = await this.roleService.getRoleByValue(
                    "USER",
                    transaction,
                );

                if (!userRole) {
                    throw new HttpException(
                        `Роль USER отсутствует в системе!`,
                        HttpStatus.BAD_REQUEST,
                    );
                }

                await user.$add("roles", [userRole.id], { transaction });
            }

            // Если роль - владелец УЦ
            // if (role.value === "STUDY_CENTER_OWNER") {
            //     // Создаем новый УЦ
            //     const sc = await this.studyCenterService.create(
            //         {
            //             name: createUserDto.studyCenterName,
            //         },
            //         transaction,
            //     );
            //
            //     if (!sc) {
            //         throw new HttpException(
            //             `Ошибка при создании учебного центра`,
            //             HttpStatus.BAD_REQUEST,
            //         );
            //     }
            //
            //     // Добавляем в него владельца как работника
            //     const employee = await this.scEmployeeService.create(
            //         {
            //             studyCenterId: sc.id,
            //             userId: user.id,
            //             roleId: role.id,
            //         },
            //         transaction,
            //     );
            // }

            // Если роль - менеджер УЦ
            // if (role.value === "STUDY_CENTER_MANAGER") {
            //     // Добавляем в него владельца как работника
            //     const employee = await this.scEmployeeService.create(
            //         {
            //             studyCenterId: createUserDto.studyCenterId,
            //             userId: user.id,
            //             roleId: role.id,
            //         },
            //         transaction,
            //     );
            // }

            // Коммит
            await transaction.commit();

            // Возвращаем токен
            return await this.generateToken(user);
        } catch (e) {
            await transaction.rollback();
            throw e;
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
