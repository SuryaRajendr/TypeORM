import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserMembership } from './user-membership.entity';
import { SubscriptionType } from './subscription-type.entity';

@Entity({ name: 'membership_type' })
export class MembershipType {
  @PrimaryGeneratedColumn({ name: 'membership_id' })
  membershipId!: number;

  @Column({ name: 'membership_name', type: 'varchar', length: 60 })
  membershipName!: string;

  @Column({ name: 'amount', type: 'int' })
  amount!: number;

  @Column({ name: 'duration', type: 'varchar', length: 60 })
  duration!: string;

  @Column({ name: 'priority_level', type: 'int', default: 1 })
  priorityLevel!: number;

  @Column({ name: 'is_ticket', type: 'int' })
  isTicket!: number;

  @Column({ name: 'subscription_typeid', type: 'int' })
  subscriptionTypeId!: number;

  @Column({ name: 'status', type: 'tinyint' })
  status!: number;

  @Column({ name: 'date_created', type: 'datetime' })
  dateCreated!: Date;

  @Column({
    name: 'date_updated',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateUpdated!: Date;

  @OneToMany(() => UserMembership, (userMembership) => userMembership.membershipType)
  userMemberships!: UserMembership[];

  @ManyToOne(
    () => SubscriptionType,
    (subscriptionType) => subscriptionType.membershipTypes,
  )
  @JoinColumn({ name: 'subscription_typeid' })
  subscriptionType!: SubscriptionType;
}
