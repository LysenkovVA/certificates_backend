import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Transaction } from "sequelize";
import { User } from "../users/entity/users.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Profile } from "./entities/profile.entity";

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(Profile) private profileRepository: typeof Profile,
    ) {}

    create(createProfileDto: CreateProfileDto) {
        return "This action adds a new profile";
    }

    findAll() {
        return `This action returns all profiles`;
    }

    async fetchByUserId(userId: number, transaction?: Transaction) {
        const result = await this.profileRepository.findOne({
            attributes: ["id", "surname", "name", "birthDate"],
            include: [{ model: User, attributes: ["id", "email"] }],
            where: { "$user.id$": { [Op.eq]: userId } },
            transaction,
        });

        const res = JSON.parse(JSON.stringify(result));

        return {
            ...res,
            avatar: `files/download/${result.id}/avatar`,
        };
    }

    async update(
        id: number,
        updateProfileDto: UpdateProfileDto,
        transaction?: Transaction,
    ) {
        const result = await this.profileRepository.update(updateProfileDto, {
            where: {
                id,
            },
            transaction,
        });

        return Number(result[0]) > 0;
    }

    remove(id: number) {
        return `This action removes a #${id} profile`;
    }
}
