import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateCheckDto } from "../../checks/dto/update-check.dto";
import { CreateCheckListGroupDto } from "./create-check-list-group.dto";

export class CreateCheckListGroupExtendedDto extends IntersectionType(
    CreateCheckListGroupDto,
) {
    @Type(() => Array<UpdateCheckDto>)
    @ApiProperty({ required: false })
    readonly checks: UpdateCheckDto[];
}
