import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { FieldInjectModule } from 'src/field-inject/field-inject.module';

@Module({
  imports: [FieldInjectModule],
  controllers: [PersonController],
  providers: [
    {
      provide: 'person_service',
      useClass: PersonService,
    },
    {
      provide: 'person_tom',
      useValue: {
        name: 'tom',
        age: 18,
      },
    },
    {
      provide: 'person_john_factory',
      useFactory: () => {
        return {
          name: 'john',
          age: 20,
        };
      },
    },

    {
      provide: 'person_john_factory_inject',
      useFactory: (tom: { name: string; age: number }) => {
        return {
          name: tom.name,
          age: tom.age,
        };
      },
      inject: ['person_tom', 'person_john_factory'],
    },
  ],
})
export class PersonModule {}
