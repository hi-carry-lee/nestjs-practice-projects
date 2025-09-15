import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface ConfigThree {
  prefix1: string;
  prefix2: string;
}

export const configThreeSchema = Joi.object({
  PREFIX: Joi.string().default('next-config-three: '),
});

export const configThree = registerAs(
  'configThree',
  (): ConfigThree => ({
    prefix1: process.env.PREFIX_ONE ?? 'next-config-three one: ',
    prefix2: process.env.PREFIX_TWO ?? 'next-config-three two: ',
  }),
);
