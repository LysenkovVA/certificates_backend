import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { CreateFileDto } from "./dto/create-file.dto";
import { File } from "./entities/file.entity";

@Injectable()
export class FilesService {
    constructor(@InjectModel(File) private fileRepository: typeof File) {}

    async upload(file: Express.Multer.File) {
        return {
            message: "File uploaded successfully!",
            filename: file.filename,
        };
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

    async remove(id: number, transaction?: Transaction) {
        return await this.fileRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
