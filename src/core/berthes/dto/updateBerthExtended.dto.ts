import { PartialType } from "@nestjs/swagger";
import { CreateBerthExtendedDto } from "./createBerthExtended.dto";

export class UpdateBerthExtendedDto extends PartialType(
    CreateBerthExtendedDto,
) {}
