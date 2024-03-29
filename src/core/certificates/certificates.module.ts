import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Protocol } from "../protocols/entities/protocols.entity";
import { Scan } from "../scans/entities/scans.entity";
import { CertificatesController } from "./certificates.controller";
import { CertificatesService } from "./certificates.service";
import { Certificate } from "./entities/certificate.entity";

@Module({
    controllers: [CertificatesController],
    providers: [CertificatesService],
    imports: [SequelizeModule.forFeature([Certificate, Protocol, Scan])],
    exports: [CertificatesService],
})
export class CertificatesModule {}
