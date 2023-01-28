import { MinLength, IsNotEmpty } from 'class-validator';

export enum UserTypeEnum {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
}

export enum AccountStatusEnum {
  CREATED = 'CREATED',
  STAGED = 'STAGED',
  LIVE = 'LIVE',
}

export class UserDTO {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  userType: UserTypeEnum;
  updatedDateTime: string;
  mobileNumber: string;
  @IsNotEmpty()
  email?: string;
  id: number;
  status?: string;
  emailVerified?: boolean;
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}

export class LoginDTO {
  email: string;
  password: string;
}
