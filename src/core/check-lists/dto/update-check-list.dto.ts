import { PartialType } from '@nestjs/swagger';
import { CreateCheckListDto } from './create-check-list.dto';

export class UpdateCheckListDto extends PartialType(CreateCheckListDto) {}
