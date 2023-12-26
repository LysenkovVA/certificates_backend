import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateBerthDto } from "../../berthes/dto/update-berth.dto";
import { UpdateDepartmentDto } from "../../departments/dto/updateDepartment.dto";
import { UpdateOrganizationDto } from "../../organizations/dto/updateOrganization.dto";
import { CreateEmployeeDto } from "./createEmployee.dto";

export class CreateEmployeeExtendedDto extends IntersectionType(
    CreateEmployeeDto,
) {
    @Type(() => UpdateOrganizationDto)
    @ApiProperty({ required: false })
    readonly organization: UpdateOrganizationDto;

    @Type(() => UpdateDepartmentDto)
    @ApiProperty({ required: false })
    readonly department: UpdateDepartmentDto;

    @Type(() => UpdateBerthDto)
    @ApiProperty({ required: false })
    readonly berth: UpdateBerthDto;
}
