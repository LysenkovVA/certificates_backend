import { Injectable } from '@nestjs/common';
import { CreateConstructionObjectDto } from './dto/create-construction-object.dto';
import { UpdateConstructionObjectDto } from './dto/update-construction-object.dto';

@Injectable()
export class ConstructionObjectsService {
  create(createConstructionObjectDto: CreateConstructionObjectDto) {
    return 'This action adds a new constructionObject';
  }

  findAll() {
    return `This action returns all constructionObjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} constructionObject`;
  }

  update(id: number, updateConstructionObjectDto: UpdateConstructionObjectDto) {
    return `This action updates a #${id} constructionObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} constructionObject`;
  }
}
