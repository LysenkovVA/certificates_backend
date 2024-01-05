import { PartialType } from "@nestjs/swagger";
import { CreateConstructionObjectExtendedDto } from "./createConstructionObjectExtended.dto";

export class UpdateConstructionObjectExtendedDto extends PartialType(
    CreateConstructionObjectExtendedDto,
) {}
