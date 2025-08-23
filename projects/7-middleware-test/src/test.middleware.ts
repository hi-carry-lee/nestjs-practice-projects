import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { OneService } from './one/one.service';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  @Inject(OneService)
  private readonly oneService: OneService;

  use(req: Request, res: Response, next: () => void) {
    console.log('custom middleware brefore');
    console.log(
      'call oneService from custom middleware: ',
      this.oneService.findAll(),
    );
    next();
    console.log('custom middleware after');
  }
}
