import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateConstructionObjectDto } from "../../construction-objects/dto/updateConstructionObject.dto";
import { UpdateDepartmentDto } from "../../departments/dto/updateDepartment.dto";
import { CreateOrganizationDto } from "./createOrganization.dto";

export class CreateOrganizationExtendedDto extends IntersectionType(
    CreateOrganizationDto,
) {
    @Type(() => Array<UpdateDepartmentDto>)
    @ApiProperty({ type: [UpdateDepartmentDto], required: false })
    readonly departments: UpdateDepartmentDto[];

    @Type(() => Array<UpdateConstructionObjectDto>)
    @ApiProperty({ type: [UpdateConstructionObjectDto], required: false })
    constructionObjects: UpdateConstructionObjectDto[];
}
