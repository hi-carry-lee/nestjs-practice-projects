import { DynamicModule, Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';

/*
1. 这是一个 Custom Module，类似于项目中用到的TypeOrmModule；
2. Nestjs提供
*/
@Module({})
export class BbbModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: BbbModule,
      controllers: [BbbController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        BbbService,
      ],
      exports: [],
    };
  }
}

// @Module({
//   controllers: [BbbController],
//   providers: [BbbService],
// })
// export class BbbModule {}
