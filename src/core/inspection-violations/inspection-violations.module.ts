import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ViolationEmployeeComment } from "../violation-employee-comments/entities/violation-employee-comment.entity";
import { ViolationPhoto } from "../violation-photos/entities/violation-photos.entity";
import { ViolationViewedBy } from "../violation_viewed_by/entities/violation_viewed_by.entity";
import { InspectionViolation } from "./entities/inspection-violation.entity";
import { InspectionViolationsController } from "./inspection-violations.controller";
import { InspectionViolationsService } from "./inspection-violations.service";

@Module({
    controllers: [InspectionViolationsController],
    providers: [InspectionViolationsService],
    imports: [
        SequelizeModule.forFeature([
            InspectionViolation,
            ViolationPhoto,
            ViolationViewedBy,
            ViolationEmployeeComment,
        ]),
    ],
    exports: [InspectionViolationsService],
})
export class InspectionViolationsModule {}
