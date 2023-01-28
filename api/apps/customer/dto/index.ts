import { IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  dateOfBirth: Date;
}
