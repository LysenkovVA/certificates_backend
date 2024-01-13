import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { File } from "./entities/file.entity";
import { FILES_PATH } from "./storage/storage";

@Injectable()
export class FilesService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

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
                await this.remove(fileId, transaction);
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
            return await this.fileRepository.destroy({
                where: { id },
                transaction,
            });
        } catch (e) {
            throw e;
        }
    }
}
