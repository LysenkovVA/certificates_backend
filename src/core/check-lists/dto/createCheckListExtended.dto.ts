import { IntersectionType } from "@nestjs/swagger";
import { CreateCheckListDto } from "./create-check-list.dto";

export class CreateCheckListExtendedDto extends IntersectionType(
    CreateCheckListDto,
) {}
