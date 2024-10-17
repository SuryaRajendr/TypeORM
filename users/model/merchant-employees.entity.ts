import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from './merchants.entity';

@Entity({ name: 'merchant_employees' })
export class MerchantEmployee {
  @PrimaryGeneratedColumn({ name: 'merchant_employee_id' })
  merchantEmployeeId: number;

  @Column({ name: 'merchant_id', type: 'int', nullable: true })
  merchantId: number;

  @Column({ name: 'userid', type: 'int', nullable: true })
  userId: number;

  @Column({ name: 'is_deleted', type: 'tinyint' })
  isDeleted: number;

  @ManyToOne(() => Merchant, (merchant) => merchant.merchantEmployees)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
