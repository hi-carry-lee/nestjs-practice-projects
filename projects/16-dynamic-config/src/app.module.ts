import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirstModule } from './first/first.module';
import { configTwo, configTwoSchema } from './config/config-two';
import { configThree, configThreeSchema } from './config/config-three';
import { TwoModule } from './two/two.module';
import { ThreeModule } from './three/three.module';

const rootConfigSchema = configTwoSchema.concat(configThreeSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true,
      load: [configTwo, configThree],
      validationSchema: rootConfigSchema,
    }),
    FirstModule,
    TwoModule,
    ThreeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
