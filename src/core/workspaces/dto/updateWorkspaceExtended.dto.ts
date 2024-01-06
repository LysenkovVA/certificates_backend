import { PartialType } from "@nestjs/swagger";
import { CreateWorkspaceExtendedDto } from "./createWorkspaceExtended.dto";

export class UpdateWorkspaceExtendedDto extends PartialType(
    CreateWorkspaceExtendedDto,
) {}
