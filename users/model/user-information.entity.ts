import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'user_information',
})
export class UserInformation {
  @PrimaryColumn({
    type: Number,
  })
  userId: number;

  @Column({
    name: 'first_name',
    nullable: true,
    type: String,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: true,
    type: String,
  })
  lastName: string;

  @Column({
    nullable: true,
    type: Number,
  })
  gender: number;

  @Column({
    default: 'en',
    type: String,
  })
  language: string;

  @Column({
    nullable: true,
    type: String,
  })
  country: string;

  @Column({
    nullable: true,
    type: String,
  })
  birthday: string;

  @Column({
    name: 'image_url',
    nullable: true,
    type: String,
  })
  imageUrl: string;

  @Column({
    default: '0.00',
    name: 'account_credit',
    precision: 10,
    scale: 2,
    type: 'decimal',
  })
  accountCredit: number;

  @Column({
    name: 'billing_address',
    type: String,
  })
  billingAddress: string;

  @Column({
    type: String,
  })
  city: string;

  @Column({
    name: 'postal_code',
    type: String,
  })
  postalCode: string;

  @Column({
    type: String,
  })
  state: string;

  @Column({
    name: 'phone_type',
    type: String,
  })
  phoneType: string;

  @Column({
    default: 0,
    name: 'is_number_verified',
    type: Number,
  })
  isNumberVerified: number;

  @Column({
    name: 'no_verification_id',
    nullable: true,
    type: String,
  })
  noVerificationId: string;

  @Column({
    default: 'SAR',
    type: String,
  })
  currency: string;

  @Column({
    default: 0,
    name: 'sms_notification',
    type: Number,
  })
  smsNotification: number;

  @Column({
    default: 1,
    name: 'deduct_point',
    type: Number,
  })
  deductPoint: number;

  @Column({
    default: 1,
    name: 'show_points_conversion',
    type: Number,
  })
  showPointsConversion: number;

  @Column({
    name: 'hotel_nationality',
    type: Number,
  })
  hotelNationality: number;

  @Column({
    name: 'hotel_residence',
    type: Number,
  })
  hotelResidence: number;
}
