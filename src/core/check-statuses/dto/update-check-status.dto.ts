import { PartialType } from '@nestjs/swagger';
import { CreateCheckStatusDto } from './create-check-status.dto';

export class UpdateCheckStatusDto extends PartialType(CreateCheckStatusDto) {}
