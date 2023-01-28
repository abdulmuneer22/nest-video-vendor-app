import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/auth/src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from '../dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  // get customer

  async getCustomer(user: any) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const customer = await this.customerRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!customer) {
      throw new NotFoundException();
    }
    return customer;
  }

  async createCustomer(
    user: User,
    customerDTO: CreateCustomerDto,
  ): Promise<Customer> {
    let exisitingCustomer = null;

    try {
      exisitingCustomer = await this.getCustomer(user);
    } catch (error) {
      Logger.log('No Existing Customer Found');
    }

    if (exisitingCustomer) {
      throw new BadRequestException();
    }

    const newCustomer = new Customer();
    newCustomer.userId = user.id;
    newCustomer.firstName = user.firstName;
    newCustomer.lastName = user.lastName;
    newCustomer.email = user.email;
    newCustomer.dateOfBirth = customerDTO?.dateOfBirth;
    newCustomer.address = customerDTO?.address;

    return await newCustomer.save();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
