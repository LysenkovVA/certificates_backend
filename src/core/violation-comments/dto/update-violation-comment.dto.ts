import { PartialType } from '@nestjs/swagger';
import { CreateViolationCommentDto } from './create-violation-comment.dto';

export class UpdateViolationCommentDto extends PartialType(CreateViolationCommentDto) {}
