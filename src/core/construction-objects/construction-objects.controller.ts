import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConstructionObjectsService } from './construction-objects.service';
import { CreateConstructionObjectDto } from './dto/create-construction-object.dto';
import { UpdateConstructionObjectDto } from './dto/update-construction-object.dto';

@Controller('construction-objects')
export class ConstructionObjectsController {
  constructor(private readonly constructionObjectsService: ConstructionObjectsService) {}

  @Post()
  create(@Body() createConstructionObjectDto: CreateConstructionObjectDto) {
    return this.constructionObjectsService.create(createConstructionObjectDto);
  }

  @Get()
  findAll() {
    return this.constructionObjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.constructionObjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConstructionObjectDto: UpdateConstructionObjectDto) {
    return this.constructionObjectsService.update(+id, updateConstructionObjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.constructionObjectsService.remove(+id);
  }
}
