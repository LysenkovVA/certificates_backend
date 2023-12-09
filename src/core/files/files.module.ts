import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { EmployeesModule } from "../employees/employees.module";
import { ProfilesModule } from "../profiles/profiles.module";
import { Protocol } from "../protocols/entities/protocols.entity";
import { Scan } from "../scans/entities/scans.entity";
import { ViolationPhoto } from "../violation-photos/entities/violation-photos.entity";
import { File } from "./entities/file.entity";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
    controllers: [FilesController],
    providers: [FilesService],
    imports: [
        SequelizeModule.forFeature([File, Protocol, Scan, ViolationPhoto]),
        ProfilesModule,
        EmployeesModule,
    ],
    exports: [FilesService],
})
export class FilesModule {}
