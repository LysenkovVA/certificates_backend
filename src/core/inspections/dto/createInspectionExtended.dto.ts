import { IntersectionType } from "@nestjs/swagger";
import { CreateInspectionDto } from "./create-inspection.dto";

export class CreateInspectionExtendedDto extends IntersectionType(
    CreateInspectionDto,
) {
    // @Type(() => UpdateOrganizationDto)
    // @ApiProperty({ required: false })
    // readonly organization: UpdateOrganizationDto;
    //
    // @Type(() => UpdateDepartmentDto)
    // @ApiProperty({ required: false })
    // readonly department: UpdateDepartmentDto;
    //
    // @Type(() => UpdateBerthDto)
    // @ApiProperty({ required: false })
    // readonly berth: UpdateBerthDto;
}
