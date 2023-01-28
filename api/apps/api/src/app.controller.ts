import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'const';

@Controller()
export class AppController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  @Get()
  getHello() {
    return this.authService.send('say-hello', {});
  }
}
