import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ViolationComment } from "./entities/violation-comment.entity";
import { ViolationCommentsController } from "./violation-comments.controller";
import { ViolationCommentsService } from "./violation-comments.service";

@Module({
    controllers: [ViolationCommentsController],
    providers: [ViolationCommentsService],
    imports: [SequelizeModule.forFeature([ViolationComment])],
    exports: [ViolationCommentsService],
})
export class ViolationCommentsModule {}
