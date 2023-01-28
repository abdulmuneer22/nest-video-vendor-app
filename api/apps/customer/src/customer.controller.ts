import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CustomerService } from './customer.service';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('get-customer')
  async getCustomer(
    @Ctx() context: RmqContext,
    @Payload() payload: { user: any },
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.customerService.getCustomer(payload.user);
  }

  @MessagePattern('create-customer')
  async createCustomer(
    @Ctx() context: RmqContext,
    @Payload() payload: { customerDTO: any; user: any },
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.customerService.createCustomer(
      payload.user,
      payload.customerDTO,
    );
  }
}
