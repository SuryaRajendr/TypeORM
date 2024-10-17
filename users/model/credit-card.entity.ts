import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('creditcard')
@Index('credit_cardid', ['credit_cardid'])
@Index('userid', ['userid'])
@Index('token', ['token'])
@Index('status', ['status'])
export class CreditCard {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  credit_cardid!: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  userid!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_created!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cc_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cc_number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cc_expiration!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cc_cvc!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cc_brand!: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  cc_bin!: string;

  @Column({ type: 'varchar', length: 255, default: '0' })
  used!: string;

  @Column({ type: 'varchar', length: 255, default: 'active' })
  status!: string;

  @Column({ type: 'tinyint', default: 0 })
  verified!: number;

  @Column({ type: 'varchar', length: 60, default: 'payfort' })
  token_gateway!: string;

  @Column({ type: 'tinyint', default: 0 })
  is_primary!: number;

  @Column({ type: 'tinyint', default: 0 })
  has_agreement_id!: number;

  @Column({ type: 'varchar', length: 60, default: '0000-00-00 00:00:00' })
  last_verified!: string;
}
