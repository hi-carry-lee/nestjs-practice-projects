import { registerAs } from '@nestjs/config';

// 因为nestjs/config 已经包含了 dotenv包，所以可以直接使用 process.env
export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || '',
}));
