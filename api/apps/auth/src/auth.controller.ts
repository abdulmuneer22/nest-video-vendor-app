import { Controller, Request, UseGuards } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { LoginDTO } from 'apps/api/dto';
import { AuthService } from './auth.service';
import { UserDTO } from './dto';
import { JwtGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('say-hello')
  async getUser(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return { user: 'FROM AUTH SERVICE' };
  }

  @MessagePattern('get-users')
  async getUsers(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService.getUsers();
  }

  @MessagePattern('register')
  async register(@Ctx() context: RmqContext, @Payload() newUser: UserDTO) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService.registerUser(newUser);
  }

  @MessagePattern('login')
  async login(@Ctx() context: RmqContext, @Payload() loginDetails: LoginDTO) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService.login(loginDetails);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return await this.authService.verifyJwt(payload.jwt);
  }
}
