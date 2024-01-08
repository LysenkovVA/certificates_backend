import { PartialType } from "@nestjs/swagger";
import { CreateCheckListExtendedDto } from "./createCheckListExtended.dto";

export class UpdateCheckListExtendedDto extends PartialType(
    CreateCheckListExtendedDto,
) {}
