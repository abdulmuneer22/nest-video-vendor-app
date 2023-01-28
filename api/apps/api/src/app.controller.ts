import { AuthGuard } from '@app/shared/auth.guard';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'apps/auth/src/entities/user.entity';
import { CreateCustomerDto } from 'apps/customer/dto';
import { AUTH_SERVICE, CUSTOMER_SERVICE } from 'const';
import { firstValueFrom } from 'rxjs';
import { LoginDTO, UserDTO } from '../dto';
import { GetUser } from './get-user-decorator';

@Controller()
export class AppController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: ClientProxy,
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: ClientProxy,
  ) {}

  @Get()
  getHello() {
    return this.authService.send('say-hello', {});
  }

  @Get('auth/users')
  getUsers() {
    return this.authService.send('get-users', {});
  }

  @Post('auth/register')
  async register(@Body() newUSer: UserDTO) {
    return this.authService.send('register', newUSer);
  }

  @Post('auth/login')
  async login(@Body() loginDetails: LoginDTO) {
    try {
      return await firstValueFrom(this.authService.send('login', loginDetails));
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Get('customer/get-customer')
  async getCustomer(@GetUser() user: User) {
    return this.customerService.send('get-customer', { user });
  }

  @UseGuards(AuthGuard)
  @Post('customer/create-customer')
  async createCustomer(
    @GetUser() user: User,
    @Body() customerDTO: CreateCustomerDto,
  ) {
    return this.customerService.send('create-customer', { user, customerDTO });
  }
}
