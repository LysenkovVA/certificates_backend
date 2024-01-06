import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./departments.service";
import { Department } from "./entities/department.entity";

@Module({
    controllers: [DepartmentsController],
    providers: [DepartmentsService],
    imports: [SequelizeModule.forFeature([Department])],
    exports: [DepartmentsService],
})
export class DepartmentsModule {}
