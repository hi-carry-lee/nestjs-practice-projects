import { HttpException } from '@nestjs/common';

export class AaaException extends HttpException {
  constructor(
    public aaa: string,
    public bbb: string,
  ) {
    super(aaa, 400);
  }
}
