import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
    fileTableAttributes,
    profileTableAttributes,
    userTableAttributes,
} from "../../infrastructure/const/tableAttributes";
import { File } from "../files/entities/file.entity";
import { FilesService } from "../files/files.service";
import { User } from "../users/entity/users.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Profile } from "./entities/profile.entity";

@Injectable()
export class ProfilesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Profile) private profileRepository: typeof Profile,
        private sequelize: Sequelize,
        @Inject(forwardRef(() => FilesService))
        private fileService: FilesService,
    ) {
        // Параметры запросов к БД
        this.attributes = profileTableAttributes;
        this.include = [
            { model: User, attributes: userTableAttributes },
            { model: File, attributes: fileTableAttributes },
        ];
    }

    async uploadAvatar(avatar: Express.Multer.File, profileId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const profile = await this.findOne(profileId, transaction);

            if (!profile) {
                throw new InternalServerErrorException("Профиль не найден!");
            }

            const file = await this.fileService.uploadFile(
                avatar,
                profile.avatar?.id,
                transaction,
            );

            await profile.$set("avatar", [file.id], { transaction });

            await transaction.commit();

            return this.fileService.findOne(file.id);
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    async deleteAvatar(profileId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const profile = await this.findOne(profileId, transaction);

            if (!profile) {
                throw new InternalServerErrorException("Профиль не найден!");
            }

            if (profile.avatar) {
                await this.fileService.remove(profile.avatar.id, transaction);
            }

            await profile.$set("avatar", null, { transaction });

            await transaction.commit();

            return true;
        } catch (e) {
            await transaction.rollback();
            throw new InternalServerErrorException(e);
        }
    }

    /**
     * Вызывается только при регистрации пользователя
     * @param createProfileDto
     * @param transaction
     */
    async create(
        createProfileDto: CreateProfileDto,
        transaction?: Transaction,
    ) {
        try {
            return await this.profileRepository.create(createProfileDto, {
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }

    async update(id: number, updateProfileDto: UpdateProfileDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Профиль не найден");
            }

            await this.profileRepository.update(updateProfileDto, {
                where: { id },
                transaction,
            });

            await transaction.commit();

            return await this.findOne(candidate.id);
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    async findOne(id: number, transaction?: Transaction) {
        try {
            const candidate = await this.profileRepository.findByPk(id, {
                attributes: this.attributes,
                include: this.include,
                order: [["surname", "ASC"]],
                transaction,
            });

            if (!candidate) {
                throw new BadRequestException("Профиль не найден");
            }

            return candidate;
        } catch (e) {
            throw e;
        }
    }
}
