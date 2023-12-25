import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
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
        this.attributes = ["id", "surname", "name", "birthDate"];
        this.include = [
            { model: User, attributes: ["id", "email"] },
            { model: File },
        ];
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

    async update(
        id: number,
        updateProfileDto: UpdateProfileDto,
        avatar?: Express.Multer.File,
    ) {
        const transaction = await this.sequelize.transaction();

        try {
            const candidate = await this.findOne(id, transaction);

            if (!candidate) {
                throw new BadRequestException("Профиль не найден");
            }

            await candidate.update(updateProfileDto, { transaction });

            // Аватар
            if (avatar) {
                // Загрузка аватара
                const file = await this.fileService.uploadFile(
                    avatar,
                    candidate.avatar?.id,
                );

                if (file) {
                    await candidate.$set("avatar", [file.id], { transaction });
                }
            } else {
                // Удаляем связи
                await candidate.$set("avatar", null, { transaction });

                // Аватар удален
                if (candidate.avatar) {
                    await this.fileService.remove(
                        candidate.avatar.id,
                        transaction,
                    );
                }
            }

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }

        return await this.findOne(id);
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
