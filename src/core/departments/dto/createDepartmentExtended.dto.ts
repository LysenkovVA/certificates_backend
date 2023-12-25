import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateOrganizationDto } from "../../organizations/dto/updateOrganization.dto";
import { CreateDepartmentDto } from "./createDepartment.dto";

export class CreateDepartmentExtendedDto extends IntersectionType(
    CreateDepartmentDto,
) {
    @Type(() => UpdateOrganizationDto)
    @ApiProperty({ type: UpdateOrganizationDto, required: false })
    readonly organization: UpdateOrganizationDto;
}
