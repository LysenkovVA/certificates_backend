import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
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
        try {
            const result = await this.authService.login(loginUserDto);

            if (result) {
                response.status(200);

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
        } catch (e) {
            throw e;
        }
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
        }

        response.status(200);
        // return response;
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

            return result;
        } else {
            response.status(500);
            response.errored.message = "Не был найден Refresh-токен";
        }
    }

    @Post("/register")
    async register(
        @Res({ passthrough: true }) response: Response,
        @Body() loginUserDto: CreateUserDto,
    ) {
        try {
            const result = await this.authService.register(loginUserDto);

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
        } catch (e) {
            throw e;
        }
    }
}
