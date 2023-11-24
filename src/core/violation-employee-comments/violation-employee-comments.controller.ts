import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { CreateViolationEmployeeCommentDto } from "./dto/create-violation-employee-comment.dto";
import { UpdateViolationEmployeeCommentDto } from "./dto/update-violation-employee-comment.dto";
import { ViolationEmployeeCommentsService } from "./violation-employee-comments.service";

@ApiTags("Комментарии работников к нарушениям")
@Controller("violation-employee-comments")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class ViolationEmployeeCommentsController {
    constructor(
        private readonly violationEmployeeCommentsService: ViolationEmployeeCommentsService,
    ) {}

    @Post()
    async create(
        @Body()
        createViolationEmployeeCommentDto: CreateViolationEmployeeCommentDto,
    ) {
        return await this.violationEmployeeCommentsService.create(
            createViolationEmployeeCommentDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.violationEmployeeCommentsService.findAll(
            +limit,
            +offset,
        );
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.violationEmployeeCommentsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body()
        updateViolationEmployeeCommentDto: UpdateViolationEmployeeCommentDto,
    ) {
        return await this.violationEmployeeCommentsService.update(
            +id,
            updateViolationEmployeeCommentDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.violationEmployeeCommentsService.remove(+id);
    }
}
