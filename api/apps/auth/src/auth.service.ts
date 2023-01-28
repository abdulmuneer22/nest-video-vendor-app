import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'apps/api/dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async validateUser(loginDetails: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDetails.email,
      },
      select: [
        'email',
        'password',
        'firstName',
        'lastName',
        'userType',
        'createdDateTime',
        'status',
        'emailVerified',
        'id',
      ],
    });

    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await bcrypt.compare(
      loginDetails.password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    delete user.password;

    return user;
  }

  async registerUser(newUser: UserDTO): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: newUser.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(newUser.password);

    const user = new User();
    user.mobileNumber = newUser.mobileNumber;
    user.userType = newUser.userType;
    user.email = newUser.email;
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.emailVerified = newUser.emailVerified;
    user.password = hashedPassword;
    const createdUser = await user.save();
    delete createdUser.password;
    return createdUser;
  }

  async login(loginDetails: LoginDTO): Promise<{ accessToken: any }> {
    const user = await this.validateUser(loginDetails);
    if (!user) {
      throw new UnauthorizedException();
    }
    const jwt = await this.jwtService.signAsync({ user });
    return { accessToken: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ validate: any }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      return await this.jwtService.verifyAsync(jwt);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
