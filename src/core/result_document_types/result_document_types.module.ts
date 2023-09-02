import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeederModule } from "nestjs-sequelize-seeder";
import { ResultDocumentType } from "./entities/result_document_type.entity";
import { SeedResultDocumentTypes } from "./result-document-types.seeder";
import { ResultDocumentTypesController } from "./result_document_types.controller";
import { ResultDocumentTypesService } from "./result_document_types.service";

@Module({
    controllers: [ResultDocumentTypesController],
    providers: [ResultDocumentTypesService],
    imports: [
        SequelizeModule.forFeature([ResultDocumentType]),
        SeederModule.forFeature([SeedResultDocumentTypes]),
    ],
    exports: [ResultDocumentTypesService],
})
export class ResultDocumentTypesModule {}
