import {
  Controller,
  Get,
  Inject,
  Res,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('token-test')
export class TokenTestController {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Get('send-token')
  generateToken(@Res({ passthrough: true }) response: Response) {
    const token = this.jwtService.sign({
      count: 1111,
    });
    response.setHeader('token', token);
    return 'generate token';
  }

  @Get('receive-token')
  getHelloNew(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data: { count: number } = this.jwtService.verify(token);

        const newToken = this.jwtService.sign({
          count: data.count + 1,
        });
        response.setHeader('token', newToken);
        return data.count + 1;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 2222,
      });

      response.setHeader('token', newToken);
      return 'receive token, handle it then return a new token';
    }
  }
}
