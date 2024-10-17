import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentCard } from './payment-cards.entity';
import { User } from './user.entity';

@Entity({ name: 'user_wallets' })
export class UserWallet {
  @PrimaryGeneratedColumn({ name: 'wallet_id' })
  walletId: number;

  @Column({ name: 'userid', type: 'int' })
  userId: number;

  @Column({ name: 'amount', type: 'float' })
  amount: number;

  @Column({ name: 'type', type: 'enum', enum: ['add', 'sub'] })
  type: 'add' | 'sub';

  @Column({ name: 'status', type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ name: 'expiration_date', type: 'datetime', nullable: true })
  expirationDate: Date;

  @Column({ name: 'payment_id', type: 'int', nullable: true })
  paymentId: number;

  @ManyToOne(() => PaymentCard, (paymentCard) => paymentCard.userWallets)
  @JoinColumn({ name: 'payment_id' })
  paymentCard: PaymentCard;

  @ManyToOne(() => User, (user) => user.userWallets)
  @JoinColumn({ name: 'userid' })
  user: User;
}
