import { Injectable } from '@nestjs/common';

@Injectable()
export class BbbService {
  findAll() {
    return `This action returns all bbb`;
  }
}
