import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {}

    @Post("/login")
    async login(
        @Body() loginUserDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.authService.login(loginUserDto);

        if (result) {
            // Добавляем Cookie в ответ
            response.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                // Для HTTPS
                // secure: this.configService.get("COOKIE_SECURE"),
                // Столько же, сколько и рефреш токен
                maxAge: this.configService.get<number>(
                    "COOKIE_REFRESH_TOKEN_MAX_AGE",
                ),
            });
        }

        return result;
    }

    @Post("/logout")
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        // Получаем Cookie из запроса
        const { refreshToken } = request.cookies;

        if (refreshToken) {
            // Удаляем токен из БД
            const result = await this.authService.logout(refreshToken);
            // Чистим Cookies из ответа
            response.clearCookie("refreshToken");
            response.status(200);

            return result;
        } else {
            response.status(500);
            response.errored.message = "Не был найден Refresh-токен";
        }
    }

    @Get("/refresh")
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        // Получаем Cookie из запроса
        const { refreshToken } = request.cookies;

        if (refreshToken) {
            const result = await this.authService.refresh(refreshToken);
            response.status(200);
            // Добавляем Cookie в ответ
            response.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                // Для HTTPS
                // secure: this.configService.get<boolean>("COOKIE_SECURE"),
                // Столько же, сколько и рефреш токен
                maxAge: this.configService.get<number>(
                    "COOKIE_REFRESH_TOKEN_MAX_AGE",
                ),
            });
        } else {
            response.status(500);
            response.errored.message = "Не был найден Refresh-токен";
        }
    }

    // TODO перенести название УЦ в dto
    @Post("/register?")
    @ApiQuery({
        name: "type",
        enum: ["ADMIN", "USER"],
    })
    // TODO Разобраться с документацией ответов (как показывать что вернется)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Возвращается токен пользователя",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: "JSON",
        description: "Описание ошибки",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: "JSON",
        description: "Описание ошибки",
    })
    async register(
        @Res({ passthrough: true }) response: Response,
        @Body() loginUserDto: CreateUserDto,
        @Query("type") type: string,
    ) {
        const result = await this.authService.register(loginUserDto, type);

        if (result) {
            // Добавляем Cookie в ответ
            response.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                // Для HTTPS
                // secure: this.configService.get<boolean>("COOKIE_SECURE"),
                // Столько же, сколько и рефреш токен
                maxAge: this.configService.get<number>(
                    "COOKIE_REFRESH_TOKEN_MAX_AGE",
                ),
            });
        }

        return result;
    }
}
