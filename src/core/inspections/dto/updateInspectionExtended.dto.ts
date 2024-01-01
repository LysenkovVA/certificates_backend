import { PartialType } from "@nestjs/swagger";
import { CreateInspectionExtendedDto } from "./createInspectionExtended.dto";

export class UpdateInspectionExtendedDto extends PartialType(
    CreateInspectionExtendedDto,
) {}
