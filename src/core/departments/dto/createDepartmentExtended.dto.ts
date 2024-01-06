import { IntersectionType } from "@nestjs/swagger";
import { CreateDepartmentDto } from "./createDepartment.dto";

export class CreateDepartmentExtendedDto extends IntersectionType(
    CreateDepartmentDto,
) {}
