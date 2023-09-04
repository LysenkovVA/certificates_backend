import { PartialType } from '@nestjs/swagger';
import { CreateCheckListCheckDto } from './create-check-list-check.dto';

export class UpdateCheckListCheckDto extends PartialType(CreateCheckListCheckDto) {}
