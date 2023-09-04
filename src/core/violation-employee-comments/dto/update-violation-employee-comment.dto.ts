import { PartialType } from '@nestjs/swagger';
import { CreateViolationEmployeeCommentDto } from './create-violation-employee-comment.dto';

export class UpdateViolationEmployeeCommentDto extends PartialType(CreateViolationEmployeeCommentDto) {}
