import { PartialType } from '@nestjs/swagger';
import { CreateBerthTypeDto } from './create-berth-type.dto';

export class UpdateBerthTypeDto extends PartialType(CreateBerthTypeDto) {}
