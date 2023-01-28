import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }

    const authHeader = context.switchToHttp().getRequest().headers[
      'authorization'
    ] as string;

    if (!authHeader) return false;

    const authHeaderParts = authHeader.split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      tap((res) => {
        this.addUser(res, context);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }

  private addUser(payload: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = payload.user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = payload.user;
    }
  }
}
