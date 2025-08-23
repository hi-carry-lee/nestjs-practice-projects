import { ConfigService } from '@nestjs/config';
import { RootConfigType } from './config.types';

export class TypedConfigService extends ConfigService<RootConfigType> {}
