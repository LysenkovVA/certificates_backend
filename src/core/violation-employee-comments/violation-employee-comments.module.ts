import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ViolationEmployeeComment } from "./entities/violation-employee-comment.entity";
import { ViolationEmployeeCommentsController } from "./violation-employee-comments.controller";
import { ViolationEmployeeCommentsService } from "./violation-employee-comments.service";

@Module({
    controllers: [ViolationEmployeeCommentsController],
    providers: [ViolationEmployeeCommentsService],
    imports: [SequelizeModule.forFeature([ViolationEmployeeComment])],
    exports: [ViolationEmployeeCommentsService],
})
export class ViolationEmployeeCommentsModule {}
