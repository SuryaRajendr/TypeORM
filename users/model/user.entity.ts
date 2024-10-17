import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEmails } from './user-emails.entity';
import { UserMembership } from './user-membership.entity';
import { UserWallet } from './user-wallets.entity';

enum UserType {
  User = 'user',
  Admin = 'admin',
}

enum MembershipType {
  Free = 'free',
  Silver = 'silver',
  Gold = 'gold',
}

enum PrefferedLanguage {
  English = 'en',
  Arabic = 'ar',
}

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn({
    name: 'userid',
  })
  userId: number;

  @Column({
    name: 'super_admin_id',
    nullable: true,
    type: Number,
  })
  superAdminId: number;

  @Column({
    name: 'email',
    nullable: true,
    type: String,
  })
  email: string;

  @Column({
    name: 'password',
    nullable: true,
    type: String,
  })
  password: string;

  @Column({
    enum: UserType,
    name: 'usertype',
    nullable: true,
    type: 'enum',
  })
  userType: 'user' | 'admin';

  @Column({
    enum: MembershipType,
    name: 'membership_type',
    nullable: true,
    type: 'enum',
  })
  membershipType: 'free' | 'silver' | 'gold';

  @Column({
    name: 'api_key',
    nullable: true,
    type: String,
  })
  apiKey: string;

  @Column({
    name: 'reset_key',
    nullable: true,
    type: String,
  })
  resetKey: string;

  @Column({
    name: 'reset_expiration',
    nullable: true,
    type: String,
  })
  resetExpiration: string;

  @Column({
    default: 0,
    name: 'status',
    type: Number,
  })
  status: number;

  @Column({
    name: 'verification_key',
    nullable: true,
    type: String,
  })
  verificationKey: string;

  @Column({
    charset: 'utf8',
    collation: 'utf8_bin',
    name: 'username',
    nullable: true,
    type: String,
  })
  username: string;

  @Column({
    name: 'is_newsletter',
    nullable: true,
    type: Number,
  })
  isNewsletter: number;

  @Column({
    name: 'default_cc',
    nullable: true,
    type: Number,
    unsigned: true,
  })
  defaultCc: number;

  @Column({
    name: 'referrer',
    nullable: true,
    type: Number,
    unsigned: true,
  })
  referrer: number;

  @Column({
    name: 'change_email',
    nullable: false,
    type: String,
  })
  changeEmail: string;

  @Column({
    default: 1,
    name: 'purchase',
    type: Number,
    unsigned: true,
  })
  purchase: number;

  @Column({
    default: PrefferedLanguage.English,
    enum: PrefferedLanguage,
    name: 'preferred_lang',
    type: 'enum',
  })
  preferredLang: 'en' | 'ar';

  @Column({
    default: 0,
    name: 'is_in_app',
    type: Number,
  })
  isInApp: number;

  @Column({
    default: 0,
    name: 'is_cvc',
    type: Number,
  })
  isCvc: number;

  @Column({
    default: 1,
    name: 'is_sadad',
    type: Number,
  })
  isSadad: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_created',
    nullable: true,
    type: Date,
  })
  dateCreated: Date;

  @Column({
    name: 'date_verified',
    nullable: true,
    type: Date,
  })
  dateVerified: Date;

  @Column({
    name: 'date_ticket_enabled',
    nullable: false,
    type: Date,
  })
  dateTicketEnabled: Date;

  @Column({
    default: 0,
    name: 'phone_verified',
    type: Number,
  })
  phoneVerified: number;

  @Column({
    name: 'phone_country',
    nullable: false,
    type: String,
  })
  phoneCountry: string;

  @Column({
    name: 'phone_number',
    nullable: false,
    type: String,
  })
  phoneNumber: string;

  @Column({
    name: 'otp_secret',
    nullable: false,
    type: String,
  })
  otpSecret: string;

  @Column({
    name: 'date_otp_verified',
    nullable: false,
    type: Date,
  })
  dateOtpVerified: Date;

  @Column({
    default: 0,
    name: 'sync',
    type: Number,
  })
  sync: number;

  @Column({
    default: 0,
    name: 'otp_attempt',
    type: Number,
  })
  otpAttempt: number;

  @OneToMany(() => UserEmails, (userEmails) => userEmails.user)
  emails!: UserEmails[];

  @OneToMany(() => UserMembership, (user_membership) => user_membership.user)
  membership_id!: UserMembership[];

  @OneToMany(() => UserWallet, (userWallet) => userWallet.user)
  userWallets: UserWallet[];
}
