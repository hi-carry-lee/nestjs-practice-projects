import { Injectable } from '@nestjs/common';

@Injectable()
export class AaaService {
  findAll() {
    return `This action returns all aaa`;
  }
}
