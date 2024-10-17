import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'user_subscription',
})
export class UserSubscription {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'userid', type: 'int' })
  userId: number;

  @Column({ name: 'type', type: 'enum', enum: ['add', 'sub'] })
  type: 'add' | 'sub';

  @Column({ name: 'group', type: 'enum', enum: ['paid', 'free'] })
  group: 'paid' | 'free';

  @Column({ name: 'remaining_flight', type: 'int' })
  remainingFlight: number;

  @Column({ name: 'wallet_point', type: 'int' })
  walletPoint: number;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;
}
