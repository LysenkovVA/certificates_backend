import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BerthesModule } from "../berthes/berthes.module";
import { DepartmentsModule } from "../departments/departments.module";
import { File } from "../files/entities/file.entity";
import { FilesModule } from "../files/files.module";
import { Inspection } from "../inspections/entities/inspection.entity";
import { Inspector } from "../inspectors/entities/inspectors.entity";
import { OrganizationsModule } from "../organizations/organizations.module";
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
            File,
        ]),
        BerthesModule,
        DepartmentsModule,
        WorkspacesModule,
        OrganizationsModule,
        forwardRef(() => FilesModule),
    ],
    exports: [EmployeesService],
})
export class EmployeesModule {}
