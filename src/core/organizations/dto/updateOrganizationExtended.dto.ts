import { PartialType } from "@nestjs/swagger";
import { CreateOrganizationExtendedDto } from "./createOrganizationExtended.dto";

export class UpdateOrganizationExtendedDto extends PartialType(
    CreateOrganizationExtendedDto,
) {}
