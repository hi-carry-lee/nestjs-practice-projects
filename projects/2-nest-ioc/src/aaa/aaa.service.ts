import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BbbService } from 'src/bbb/bbb.service';

@Injectable()
export class AaaService {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  testModuleRef() {
    const bbbService = this.moduleRef.get<BbbService>(BbbService);
    return bbbService.findAll();
  }

  findAll() {
    return `This action returns all aaa`;
  }
}
