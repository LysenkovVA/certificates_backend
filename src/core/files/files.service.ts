import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import fs from "fs";
import path from "path";
import { Transaction } from "sequelize";
import { ProfilesService } from "../profiles/profiles.service";
import { File } from "./entities/file.entity";
import { FILES_PATH } from "./storage/storage";

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File) private fileRepository: typeof File,
        private profileService: ProfilesService,
    ) {}

    async findOne(id: number, transaction?: Transaction) {
        return await this.fileRepository.findByPk(id, { transaction });
    }

    private async uploadFile(
        fileToUpload: Express.Multer.File,
        fileId?: number,
    ) {
        if (!fileToUpload) {
            throw new BadRequestException(
                "Файл, который требуется загрузить не найден!",
            );
        }

        try {
            // Обновляем существующий файл (запись в БД)
            if (fileId) {
                const existingFile = await this.fileRepository.findByPk(fileId);

                if (!existingFile) {
                    throw new BadRequestException(
                        `Файл с идентификатором ${fileId} не найден в БД!`,
                    );
                }
                // Удаляем старый файл из хранилища файлов
                fs.rmSync(path.resolve(FILES_PATH, existingFile.path));

                // Обновляем запись в БД о новом файле
                await existingFile.update({
                    name: fileToUpload.filename,
                    path: fileToUpload.path
                        .replace(FILES_PATH, "")
                        .replace("/", ""),
                    format: fileToUpload.mimetype,
                    sizeAtBytes: fileToUpload.size,
                });

                // Возвращаем обновленный файл
                return existingFile;
            }

            // Запись о файле еще не существует в БД, создаем новую
            return await this.fileRepository.create({
                name: fileToUpload.filename,
                path: fileToUpload.path
                    .replace(FILES_PATH, "")
                    .replace("/", ""),
                format: fileToUpload.mimetype,
                sizeAtBytes: fileToUpload.size,
            });
        } catch (e) {
            throw e;
        }
    }

    async uploadProfileAvatar(file: Express.Multer.File, profileId: number) {
        try {
            const profile = await this.profileService.findById(profileId);

            if (!profile) {
                throw new BadRequestException(
                    `Профиль с идентификатором ${profileId} не найден в БД!`,
                );
            }

            const uploadedFile = await this.uploadFile(
                file,
                profile.avatar?.id,
            );

            if (uploadedFile) {
                await profile.$set("avatar", uploadedFile);
            }
        } catch (e) {
            throw e;
        }
    }

    // async uploadAvatar(file: Express.Multer.File, profileId: string) {
    //     try {
    //         // Ищем профиль
    //         const profile = await this.profileService.findById(
    //             Number(profileId),
    //         );
    //
    //         // Если аватар еще не был загружен, создаем его
    //         if (!profile.avatar) {
    //             const newFile = await this.create({
    //                 name: file.filename,
    //                 path: file.path.replace(FILES_PATH, "").replace("/", ""),
    //                 format: file.mimetype,
    //                 sizeAtBytes: file.size,
    //             });
    //             await profile.$set("avatar", newFile);
    //         } else {
    //             // Если аватар был ранее загружен
    //             // Удаляем файл из физического хранилища
    //             fs.rmSync(path.resolve(FILES_PATH, profile.avatar.path));
    //
    //             // Обновляем значения в БД
    //             await this.update(
    //                 {
    //                     name: file.filename,
    //                     path: file.path
    //                         .replace(FILES_PATH, "")
    //                         .replace("/", ""),
    //                     format: file.mimetype,
    //                     sizeAtBytes: file.size,
    //                 },
    //                 profile.avatar.id,
    //             );
    //         }
    //
    //         return profile.avatar;
    //     } catch {
    //         // Ошибка, удаляем загруженный файл
    //         // TODO протестировать правильность!
    //         fs.rmSync(path.resolve(FILES_PATH, file.filename));
    //     }
    // }
    //
    // async create(createFileDto: CreateFileDto, transaction?: Transaction) {
    //     return await this.fileRepository.create(createFileDto, { transaction });
    // }
    //

    //
    // async update(
    //     updateFileDto: UpdateFileDto,
    //     id: number,
    //     transaction?: Transaction,
    // ) {
    //     return await this.fileRepository.update(updateFileDto, {
    //         where: { id },
    //         transaction,
    //     });
    // }
    //
    // async remove(id: number, transaction?: Transaction) {
    //     return await this.fileRepository.destroy({
    //         where: { id },
    //         transaction,
    //     });
    // }
}
