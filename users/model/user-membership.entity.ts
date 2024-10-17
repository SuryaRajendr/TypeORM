import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { MembershipType } from './membership-type.entity';

@Entity({ name: 'user_membership' })
export class UserMembership {
  @PrimaryGeneratedColumn({ name: 'user_membership_id' })
  userMembershipId!: number;

  @Column({ name: 'membership_id', type: 'int' })
  membershipId!: number;

  @Column({ name: 'userid', type: 'int' })
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userid' })
  user!: User;

  @Column({ name: 'is_auto_renew', type: 'tinyint' })
  isAutoRenew!: boolean;

  @Column({ name: 'is_active', type: 'tinyint' })
  isActive!: boolean;

  @Column({ name: 'payment_id', type: 'int', unsigned: true, nullable: true })
  paymentId?: number;

  @Column({ name: 'next_membership', type: 'int' })
  nextMembership!: number;

  @Column({ name: 'purchase_card', type: 'int' })
  purchaseCard!: number;

  @Column({ name: 'renew_card', type: 'int' })
  renewCard!: number;

  @Column({ name: 'date_start', type: 'date' })
  dateStart!: Date;

  @Column({ name: 'date_end', type: 'date' })
  dateEnd!: Date;

  @Column({ name: 'admin_id', type: 'int' })
  adminId!: number;

  @Column({ name: 'is_free', type: 'tinyint' })
  isFree!: boolean;

  @Column({ name: 'is_split', type: 'tinyint' })
  isSplit!: boolean;

  @Column({ name: 'split_payment_ids', type: 'varchar', length: 255 })
  splitPaymentIds!: string;

  @Column({ name: 'date_created', type: 'datetime' })
  dateCreated!: Date;

  @Column({
    name: 'date_updated',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateUpdated!: Date;

  @ManyToOne(() => MembershipType, (membershipType) => membershipType.userMemberships)
  @JoinColumn({ name: 'membership_id' })
  membershipType!: MembershipType;
}
