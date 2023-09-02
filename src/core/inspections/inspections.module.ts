import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Employee } from "../employees/entities/employee.entity";
import { Inspector } from "../inspectors/entities/inspectors.entity";
import { RepresentativeEmployee } from "../representative-employees/entities/representative-employees.entity";
import { Inspection } from "./entities/inspection.entity";
import { InspectionsController } from "./inspections.controller";
import { InspectionsService } from "./inspections.service";

@Module({
    controllers: [InspectionsController],
    providers: [InspectionsService],
    imports: [
        SequelizeModule.forFeature([
            Inspection,
            RepresentativeEmployee,
            Employee,
            Inspector,
        ]),
    ],
    exports: [InspectionsService],
})
export class InspectionsModule {}
