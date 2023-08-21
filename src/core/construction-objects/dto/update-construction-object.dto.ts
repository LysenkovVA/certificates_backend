import { PartialType } from '@nestjs/swagger';
import { CreateConstructionObjectDto } from './create-construction-object.dto';

export class UpdateConstructionObjectDto extends PartialType(CreateConstructionObjectDto) {}
