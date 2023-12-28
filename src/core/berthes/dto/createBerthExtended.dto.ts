import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UpdateBerthTypeDto } from "../../berth-types/dto/update-berth-type.dto";
import { CreateBerthDto } from "./create-berth.dto";

export class CreateBerthExtendedDto extends IntersectionType(CreateBerthDto) {
    @Type(() => UpdateBerthTypeDto)
    @ApiProperty({ required: false })
    readonly berthType: UpdateBerthTypeDto;
}
