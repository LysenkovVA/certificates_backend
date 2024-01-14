import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ViolationPhoto } from "../violation-photos/entities/violation-photos.entity";
import { InspectionViolation } from "./entities/inspection-violation.entity";
import { InspectionViolationsController } from "./inspection-violations.controller";
import { InspectionViolationsService } from "./inspection-violations.service";

@Module({
    controllers: [InspectionViolationsController],
    providers: [InspectionViolationsService],
    imports: [
        SequelizeModule.forFeature([InspectionViolation, ViolationPhoto]),
    ],
    exports: [InspectionViolationsService],
})
export class InspectionViolationsModule {}
