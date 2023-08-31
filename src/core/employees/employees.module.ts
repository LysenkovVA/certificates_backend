import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { Employee } from "./entities/employee.entity";

@Module({
    controllers: [EmployeesController],
    providers: [EmployeesService],
    imports: [SequelizeModule.forFeature([Employee])],
    exports: [EmployeesService],
})
export class EmployeesModule {}
