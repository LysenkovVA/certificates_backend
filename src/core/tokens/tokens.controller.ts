import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { CreateTokenDto } from "./dto/create-token.dto";
import { UpdateTokenDto } from "./dto/update-token.dto";
import { TokensService } from "./tokens.service";

// TODO Контролер не нужен?
@Controller("tokens")
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @Post()
    async create(@Body() createTokenDto: CreateTokenDto) {
        return await this.tokensService.create(createTokenDto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateTokenDto: UpdateTokenDto) {
        return this.tokensService.update(+id, updateTokenDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.tokensService.remove(+id);
    }
}
