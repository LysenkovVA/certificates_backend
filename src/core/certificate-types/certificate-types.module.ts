import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CertificateTypesController } from "./certificate-types.controller";
import { CertificateTypesService } from "./certificate-types.service";
import { CertificateType } from "./entities/certificate-type.entity";

@Module({
    controllers: [CertificateTypesController],
    providers: [CertificateTypesService],
    imports: [SequelizeModule.forFeature([CertificateType])],
    exports: [CertificateTypesService],
})
export class CertificateTypesModule {}
