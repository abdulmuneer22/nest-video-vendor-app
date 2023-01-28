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
  firstName: string;
  lastName: string;
  userType: UserTypeEnum;
  updatedDateTime: string;
  mobileNumber: string;
  email?: string;
  id: number;
  status?: string;
  emailVerified?: boolean;
  password?: string;
}
