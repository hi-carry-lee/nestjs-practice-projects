import { Injectable } from '@nestjs/common';

@Injectable()
export class BbbService {
  findAll() {
    return `This action returns all bbb`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bbb`;
  }
}
