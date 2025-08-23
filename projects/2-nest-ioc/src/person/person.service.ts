import { Injectable, Inject } from '@nestjs/common';
import { FieldInjectService } from 'src/field-inject/field-inject.service';

@Injectable()
export class PersonService {
  @Inject(FieldInjectService)
  private readonly fieldInjectService: FieldInjectService;

  @Inject('person_tom')
  private readonly tom: { name: string; age: number };

  @Inject('person_john_factory')
  private readonly john: { name: string; age: number };

  @Inject('person_john_factory_inject')
  private readonly johnInject: { name: string; age: number };

  testFieldInject() {
    return this.fieldInjectService.findAll();
  }

  testValueInject() {
    return `Inject value: tom: name:${this.tom.name}, age:${this.tom.age} john: name:${this.john.name}, age:${this.john.age} `;
  }

  testFactoryInject() {
    return `name:${this.johnInject.name}, age:${this.johnInject.age} `;
  }

  create() {
    return 'This action adds a new person';
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
