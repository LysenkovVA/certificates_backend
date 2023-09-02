import { PartialType } from "@nestjs/swagger";
import { CreateBerthDto } from "./create-berth.dto";

export class UpdateBerthDto extends PartialType(CreateBerthDto) {}
