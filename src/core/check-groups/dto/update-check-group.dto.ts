import { PartialType } from '@nestjs/swagger';
import { CreateCheckGroupDto } from './create-check-group.dto';

export class UpdateCheckGroupDto extends PartialType(CreateCheckGroupDto) {}
