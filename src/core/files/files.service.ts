import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import fs from "fs";
import path from "path";
import { Transaction } from "sequelize";
import { EmployeesService } from "../employees/employees.service";
import { ProfilesService } from "../profiles/profiles.service";
import { File } from "./entities/file.entity";
import { FILES_PATH } from "./storage/storage";

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File) private fileRepository: typeof File,
        private profileService: ProfilesService,
        private employeeService: EmployeesService,
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

    async uploadEmployeeAvatar(file: Express.Multer.File, employeeId: number) {
        try {
            const employee = await this.employeeService.findOne(employeeId);

            if (!employee) {
                throw new BadRequestException(
                    `Сотрудник с идентификатором ${employeeId} не найден в БД!`,
                );
            }

            const uploadedFile = await this.uploadFile(
                file,
                employee.avatar?.id,
            );

            if (uploadedFile) {
                await employee.$set("avatar", uploadedFile);
            }
        } catch (e) {
            throw e;
        }
    }
}
