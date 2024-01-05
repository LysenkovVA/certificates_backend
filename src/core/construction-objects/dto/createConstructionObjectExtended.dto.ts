import { IntersectionType } from "@nestjs/swagger";
import { CreateConstructionObjectDto } from "./createConstructionObject.dto";

export class CreateConstructionObjectExtendedDto extends IntersectionType(
    CreateConstructionObjectDto,
) {}
