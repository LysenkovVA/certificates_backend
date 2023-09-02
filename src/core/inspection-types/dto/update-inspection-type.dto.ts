import { PartialType } from '@nestjs/swagger';
import { CreateInspectionTypeDto } from './create-inspection-type.dto';

export class UpdateInspectionTypeDto extends PartialType(CreateInspectionTypeDto) {}
