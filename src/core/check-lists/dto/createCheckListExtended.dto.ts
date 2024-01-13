import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateCheckListGroupExtendedDto } from "../../check-list-groups/dto/updateCheckListGroupExtended.dto";
import { CreateCheckListDto } from "./create-check-list.dto";

export class CreateCheckListExtendedDto extends IntersectionType(
    CreateCheckListDto,
) {
    @Type(() => Array<UpdateCheckListGroupExtendedDto>)
    @ApiProperty({ required: false })
    readonly checkListGroups: UpdateCheckListGroupExtendedDto[];
}
