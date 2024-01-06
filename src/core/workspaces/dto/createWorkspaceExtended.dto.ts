import { IntersectionType } from "@nestjs/swagger";
import { CreateWorkspaceDto } from "./create-workspace.dto";

export class CreateWorkspaceExtendedDto extends IntersectionType(
    CreateWorkspaceDto,
) {}
