import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateViolationCommentDto } from "./dto/create-violation-comment.dto";
import { UpdateViolationCommentDto } from "./dto/update-violation-comment.dto";
import { ViolationCommentsService } from "./violation-comments.service";

@ApiTags("Комментарии к нарушению (что нарушено)")
@Controller("violation-comments")
export class ViolationCommentsController {
    constructor(
        private readonly violationCommentsService: ViolationCommentsService,
    ) {}

    @Post()
    async create(@Body() createViolationCommentDto: CreateViolationCommentDto) {
        return await this.violationCommentsService.create(
            createViolationCommentDto,
        );
    }

    @Get()
    async findAll(
        @Query("limit") limit: string,
        @Query("offset") offset: string,
    ) {
        return await this.violationCommentsService.findAll(+limit, +offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.violationCommentsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateViolationCommentDto: UpdateViolationCommentDto,
    ) {
        return await this.violationCommentsService.update(
            +id,
            updateViolationCommentDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.violationCommentsService.remove(+id);
    }
}
