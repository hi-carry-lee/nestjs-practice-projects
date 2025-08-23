import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { AaaException } from './AaaException';

@Catch(AaaException)
export class TestFilter implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      // const request = ctx.getRequest<Request>();

      response.status(500).json({
        aaa: exception.aaa,
        bbb: exception.bbb,
      });
    } else if (host.getType() === 'ws') {
      console.log('websocket');
    } else if (host.getType() === 'rpc') {
      console.log('rpc');
    }
  }
}
