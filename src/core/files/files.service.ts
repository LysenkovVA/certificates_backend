import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import fs from "fs";
import path from "path";
import { Transaction } from "sequelize";
import { ProfilesService } from "../profiles/profiles.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { File } from "./entities/file.entity";
import { FILES_PATH } from "./storage/storage";

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File) private fileRepository: typeof File,
        private profileService: ProfilesService,
    ) {}

    async uploadAvatar(file: Express.Multer.File, profileId: string) {
        try {
            // Ищем профиль
            const profile = await this.profileService.findById(
                Number(profileId),
            );

            // Если аватар еще не был загружен, создаем его
            if (!profile.avatar) {
                const newFile = await this.create({
                    name: file.filename,
                    path: file.path.replace(FILES_PATH, "").replace("/", ""),
                    format: file.mimetype,
                    sizeAtBytes: file.size,
                });
                await profile.$set("avatar", newFile);
            } else {
                // Если аватар был ранее загружен
                // Удаляем файл из физического хранилища
                fs.rmSync(path.resolve(FILES_PATH, profile.avatar.path));

                // Обновляем значения в БД
                await this.update(
                    {
                        name: file.filename,
                        path: file.path
                            .replace(FILES_PATH, "")
                            .replace("/", ""),
                        format: file.mimetype,
                        sizeAtBytes: file.size,
                    },
                    profile.avatar.id,
                );
            }

            return profile.avatar;
        } catch {
            // Ошибка, удаляем загруженный файл
            // TODO протестировать правильность!
            fs.rmSync(path.resolve(FILES_PATH, file.filename));
        }
    }

    async downloadAvatar(profileId: string) {
        // Ищем профиль
        const profile = await this.profileService.findById(Number(profileId));

        if (profile && profile.avatar) {
            return profile.avatar;
        }

        return undefined;
    }

    async create(createFileDto: CreateFileDto, transaction?: Transaction) {
        return await this.fileRepository.create(createFileDto, { transaction });
    }

    async findOne(id: number, transaction?: Transaction) {
        return await this.fileRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async update(
        updateFileDto: UpdateFileDto,
        id: number,
        transaction?: Transaction,
    ) {
        return await this.fileRepository.update(updateFileDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return await this.fileRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
