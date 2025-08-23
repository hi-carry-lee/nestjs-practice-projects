import { Injectable } from '@nestjs/common';
import { CreateFieldInjectDto } from './dto/create-field-inject.dto';
import { UpdateFieldInjectDto } from './dto/update-field-inject.dto';

@Injectable()
export class FieldInjectService {
  create(createFieldInjectDto: CreateFieldInjectDto) {
    return `This action adds a new fieldInject ${createFieldInjectDto.name}`;
  }

  findAll() {
    return `This action returns all fieldInject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldInject`;
  }

  update(id: number, updateFieldInjectDto: UpdateFieldInjectDto) {
    return `This action updates a #${id} fieldInject, ${updateFieldInjectDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldInject`;
  }
}
