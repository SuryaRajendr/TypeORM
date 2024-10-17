import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sync_accounts')
export class SyncAccount {
  @PrimaryGeneratedColumn()
  sync_account_id!: number;

  @Column({ type: 'int' })
  userid!: number;

  @Column({ type: 'int' })
  v2_userid!: number;

  @Column({ type: 'varchar', length: 60 })
  phone_country!: string;

  @Column({ type: 'varchar', length: 60 })
  phone_number!: string;

  @Column({ type: 'varchar', length: 60 })
  email!: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  first_name!: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  last_name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url!: string | null;

  @Column({ type: 'varchar', length: 60 })
  otp_secret!: string;

  @Column({ type: 'tinyint' })
  status!: number;

  @Column({ type: 'tinyint' })
  v2_booking!: number;

  @Column({ type: 'tinyint' })
  v2_cc!: number;

  @Column({ type: 'tinyint' })
  v2_passenger!: number;

  @Column({ type: 'tinyint' })
  v2_user_subscription!: number;

  @Column({ type: 'tinyint' })
  v2_payment!: number;

  @Column({ type: 'tinyint' })
  v2_membership!: number;

  @Column({ type: 'tinyint' })
  booking!: number;

  @Column({ type: 'tinyint' })
  cc!: number;

  @Column({ type: 'tinyint' })
  passenger!: number;

  @Column({ type: 'tinyint' })
  user_subscription!: number;

  @Column({ type: 'tinyint' })
  payment!: number;

  @Column({ type: 'tinyint' })
  membership!: number;

  @Column({ type: 'tinyint' })
  deleted!: number;

  @Column({ type: 'datetime' })
  date_verified!: Date;

  @CreateDateColumn({ type: 'datetime' })
  date_created!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  date_updated!: Date;
}
