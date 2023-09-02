import { PartialType } from '@nestjs/swagger';
import { CreateResultDocumentTypeDto } from './create-result_document_type.dto';

export class UpdateResultDocumentTypeDto extends PartialType(CreateResultDocumentTypeDto) {}
