import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Certificate } from "../certificates/entities/certificate.entity";
import { File } from "../files/entities/file.entity";
import { FilesModule } from "../files/files.module";
import { Inspection } from "../inspections/entities/inspection.entity";
import { Inspector } from "../inspectors/entities/inspectors.entity";
import { RepresentativeEmployee } from "../representative-employees/entities/representative-employees.entity";
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
            File,
            Certificate,
        ]),
        forwardRef(() => FilesModule),
    ],
    exports: [EmployeesService],
})
export class EmployeesModule {}
