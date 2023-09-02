import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Protocol } from "../protocols/entities/protocols.entity";
import { Scan } from "../scans/entities/scans.entity";
import { File } from "./entities/file.entity";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
    controllers: [FilesController],
    providers: [FilesService],
    imports: [SequelizeModule.forFeature([File, Protocol, Scan])],
    exports: [FilesService],
})
export class FilesModule {}
