import { PartialType } from "@nestjs/swagger";
import { CreateEmployeeExtendedDto } from "./createEmployeeExtended.dto";

export class UpdateEmployeeExtendedDto extends PartialType(
    CreateEmployeeExtendedDto,
) {}
