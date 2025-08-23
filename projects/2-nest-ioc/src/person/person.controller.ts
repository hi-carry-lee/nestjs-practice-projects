import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  Inject,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreatePersonDto } from './dto/create-person.dto';

@Controller('api/person')
export class PersonController {
  constructor(
    @Inject('person_service') private readonly personService: PersonService,
  ) {}

  @Post()
  create() {
    return this.personService.create();
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get('query')
  query(@Query('name') name: string, @Query('age') age: number): string {
    return `query param, name: ${name}, age: ${age}`;
  }

  @Post('url-encoded')
  urlEncoded(@Body() body: CreatePersonDto): string {
    return `url encoded param, body: ${body.name}, ${body.age}`;
  }

  @Post('json')
  json(@Body() body: CreatePersonDto): string {
    return `json param, body: ${body.name}, ${body.age}`;
  }

  @Post('files')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  upload(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles() files: Express.Request,
  ): string {
    console.log(files);
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  @Get('value-inject')
  testValueInject() {
    return this.personService.testValueInject();
  }

  @Get('test-field-inject')
  testFieldInject() {
    return this.personService.testFieldInject();
  }

  @Get('test-factory-inject')
  testFactoryInject() {
    return this.personService.testFactoryInject();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const a = 1;
    const b = id;
    console.log('Debug variables:', a, b); // 使用这些变量
    const c = 1;
    const d = c;
    const arr = [1, 2, 3];
    console.log(a, b, c, d, arr);
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.personService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
