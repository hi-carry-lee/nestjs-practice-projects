import { Injectable } from '@nestjs/common';

@Injectable()
export class OneService {
  findAll() {
    return `This action returns all one`;
  }

  findOne(id: number) {
    return `This action returns a #${id} one`;
  }
}
