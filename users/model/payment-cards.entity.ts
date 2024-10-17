import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserWallet } from './user-wallets.entity';

@Entity({ name: 'payment_cards' })
export class PaymentCard {
  @PrimaryGeneratedColumn({ name: 'payment_id' })
  paymentId: number;

  @Column({ name: 'type', type: 'enum', enum: ['refund_fee', 'service_fee', 'other'] })
  type: 'refund_fee' | 'service_fee' | 'other';

  @OneToMany(() => UserWallet, (userWallet) => userWallet.paymentCard)
  userWallets: UserWallet[];
}
