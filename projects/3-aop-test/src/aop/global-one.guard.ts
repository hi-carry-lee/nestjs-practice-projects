import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable()
export class GlobalOneGuard implements CanActivate {
  @Inject(AppService)
  private readonly appService: AppService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('global one check');
    // console.log('Global guard one: ', this.appService.getHello());
    return true;
  }
}
