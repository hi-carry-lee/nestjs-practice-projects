import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldInjectDto } from './create-field-inject.dto';

export class UpdateFieldInjectDto extends PartialType(CreateFieldInjectDto) {}
