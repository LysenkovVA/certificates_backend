import { Body, Controller, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    async login(@Body() loginUserDto: LoginDto) {
        return await this.authService.login(loginUserDto);
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
        @Body() loginUserDto: CreateUserDto,
        @Query("type") type: string,
    ) {
        return await this.authService.register(loginUserDto, type);
    }
}
