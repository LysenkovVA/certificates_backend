import { PartialType } from '@nestjs/swagger';
import { CreateInspectionViolationDto } from './create-inspection-violation.dto';

export class UpdateInspectionViolationDto extends PartialType(CreateInspectionViolationDto) {}
