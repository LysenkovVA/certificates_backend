import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BerthesModule } from "../berthes/berthes.module";
import { DepartmentsModule } from "../departments/departments.module";
import { Inspection } from "../inspections/entities/inspection.entity";
import { Inspector } from "../inspectors/entities/inspectors.entity";
import { RepresentativeEmployee } from "../representative-employees/entities/representative-employees.entity";
import { ViolationEmployeeComment } from "../violation-employee-comments/entities/violation-employee-comment.entity";
import { ViolationViewedBy } from "../violation_viewed_by/entities/violation_viewed_by.entity";
import { WorkspacesModule } from "../workspaces/workspaces.module";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { Employee } from "./entities/employee.entity";

@Module({
    controllers: [EmployeesController],
    providers: [EmployeesService],
    imports: [
        SequelizeModule.forFeature([
            Employee,
            RepresentativeEmployee,
            Inspection,
            Inspector,
            ViolationViewedBy,
            ViolationEmployeeComment,
        ]),
        BerthesModule,
        DepartmentsModule,
        WorkspacesModule,
    ],
    exports: [EmployeesService],
})
export class EmployeesModule {}
