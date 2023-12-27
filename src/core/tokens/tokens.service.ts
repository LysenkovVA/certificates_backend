import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { tokenTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateTokenDto } from "./dto/create-token.dto";
import { UpdateTokenDto } from "./dto/update-token.dto";
import { Token } from "./entities/token.entity";

@Injectable()
export class TokensService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(@InjectModel(Token) private tokenRepository: typeof Token) {
        this.attributes = tokenTableAttributes;
    }

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
