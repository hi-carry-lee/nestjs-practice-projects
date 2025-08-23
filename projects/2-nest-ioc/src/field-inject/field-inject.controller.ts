import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FieldInjectService } from './field-inject.service';
import { CreateFieldInjectDto } from './dto/create-field-inject.dto';
import { UpdateFieldInjectDto } from './dto/update-field-inject.dto';

@Controller('field-inject')
export class FieldInjectController {
  constructor(private readonly fieldInjectService: FieldInjectService) {}

  @Post()
  create(@Body() createFieldInjectDto: CreateFieldInjectDto) {
    return this.fieldInjectService.create(createFieldInjectDto);
  }

  @Get()
  findAll() {
    return this.fieldInjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldInjectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFieldInjectDto: UpdateFieldInjectDto,
  ) {
    return this.fieldInjectService.update(+id, updateFieldInjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldInjectService.remove(+id);
  }
}
