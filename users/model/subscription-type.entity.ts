import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MembershipType } from './membership-type.entity';

export enum Renew {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export enum Type {
  Paid = 'paid',
  Free = 'free',
}

@Entity({ name: 'subscription_type' })
export class SubscriptionType {
  @PrimaryGeneratedColumn({ name: 'subscription_typeid' })
  subscriptionTypeId!: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'name_ar', type: 'varchar', length: 255 })
  nameAr!: string;

  @Column({ name: 'description', type: 'text' })
  description!: string;

  @Column({ name: 'description_ar', type: 'text' })
  descriptionAr!: string;

  @Column({ name: 'num_of_flight', type: 'int', width: 10 })
  numOfFlight!: number;

  @Column({ name: 'is_unlimited', type: 'tinyint', width: 1 })
  isUnlimited!: boolean;

  @Column({ name: 'day', type: 'int', width: 5, default: () => 0 })
  day!: number;

  @Column({ name: 'month', type: 'int', width: 5, default: () => 0 })
  month!: number;

  @Column({ name: 'year', type: 'int', width: 5, default: () => 0 })
  year!: number;

  @Column({ name: 'price', type: 'float' })
  price!: number;

  @Column({
    name: 'renew',
    type: 'enum',
    enum: Renew,
    default: Renew.Day,
  })
  renew!: Renew;

  @Column({
    name: 'type',
    type: 'enum',
    enum: Type,
    default: Type.Paid,
  })
  type!: Type;

  @Column({ name: 'status', type: 'tinyint', width: 4 })
  status!: number;

  @Column({ name: 'wallet_point', type: 'int', width: 11 })
  walletPoint!: number;

  @Column({
    name: 'date_created',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateCreated!: Date;

  @Column({ name: 'is_purchase', type: 'int', width: 1 })
  isPurchase!: boolean;

  @OneToMany(() => MembershipType, (membershipType) => membershipType.subscriptionType)
  membershipTypes!: MembershipType[];
}
