import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateFileDto } from "./dto/create-file.dto";
import { FilesService } from "./files.service";

@ApiTags("Файлы")
@Controller("files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    async create(@Body() createFileDto: CreateFileDto) {
        return await this.filesService.create(createFileDto);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.filesService.findOne(+id);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.filesService.remove(+id);
    }
}
