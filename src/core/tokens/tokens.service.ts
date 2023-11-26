import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateTokenDto } from "./dto/create-token.dto";
import { UpdateTokenDto } from "./dto/update-token.dto";
import { Token } from "./entities/token.entity";

@Injectable()
export class TokensService {
    constructor(@InjectModel(Token) private tokenRepository: typeof Token) {}

    async create(createTokenDto: CreateTokenDto, transaction?: Transaction) {
        return await this.tokenRepository.create(createTokenDto, {
            transaction,
        });
    }

    async findRefreshToken(refreshToken: string, transaction?: Transaction) {
        return await this.tokenRepository.findOne({
            where: {
                refreshToken,
            },
            transaction,
        });
    }

    async update(
        id: number,
        updateTokenDto: UpdateTokenDto,
        transaction?: Transaction,
    ) {
        return await this.tokenRepository.update(updateTokenDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.tokenRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
