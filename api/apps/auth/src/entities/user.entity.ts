import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AccountStatusEnum, UserTypeEnum } from '../dto';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'simple-enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.CUSTOMER,
  })
  userType: UserTypeEnum;

  @Column({ nullable: true, default: new Date() })
  updatedDateTime: Date;

  @Column({ nullable: true, default: new Date() })
  createdDateTime: Date;

  @Column({
    type: 'simple-enum',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.CREATED,
  })
  status: AccountStatusEnum;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  firebaseUserId: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  signInProvider: string;

  @Column({ default: false })
  emailVerified: boolean;
}
