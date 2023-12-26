import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import fs from "fs";
import path from "path";
import { Transaction } from "sequelize";
import { File } from "./entities/file.entity";
import { FILES_PATH } from "./storage/storage";

@Injectable()
export class FilesService {
    constructor(@InjectModel(File) private fileRepository: typeof File) {}

    async findOne(id: number, transaction?: Transaction) {
        return await this.fileRepository.findByPk(id, { transaction });
    }

    public async uploadFile(
        fileToUpload: Express.Multer.File,
        fileId?: number,
        transaction?: Transaction,
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
                const filePath = path.resolve(FILES_PATH, existingFile.path);
                if (fs.existsSync(filePath)) {
                    fs.rmSync(filePath);
                }

                // Обновляем запись в БД о новом файле
                await existingFile.update(
                    {
                        name: fileToUpload.filename,
                        path: fileToUpload.path
                            .replace(FILES_PATH, "")
                            .replace("/", ""),
                        format: fileToUpload.mimetype,
                        sizeAtBytes: fileToUpload.size,
                    },
                    { transaction },
                );

                // Возвращаем обновленный файл
                return existingFile;
            }

            // Запись о файле еще не существует в БД, создаем новую
            return await this.fileRepository.create(
                {
                    name: fileToUpload.filename,
                    path: fileToUpload.path
                        .replace(FILES_PATH, "")
                        .replace("/", ""),
                    format: fileToUpload.mimetype,
                    sizeAtBytes: fileToUpload.size,
                },
                { transaction },
            );
        } catch (e) {
            throw e;
        }
    }

    async remove(id: number, transaction?: Transaction) {
        try {
            if (id) {
                const existingFile = await this.fileRepository.findByPk(id);

                if (!existingFile) {
                    throw new BadRequestException(
                        `Файл с идентификатором ${id} не найден в БД!`,
                    );
                }
                // Удаляем старый файл из хранилища файлов
                const filePath = path.resolve(FILES_PATH, existingFile.path);
                if (fs.existsSync(filePath)) {
                    fs.rmSync(filePath);
                }
            }

            return await this.fileRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
