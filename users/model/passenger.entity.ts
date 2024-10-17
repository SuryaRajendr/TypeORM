import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('passenger')
@Index('passengerid', ['passengerid'])
@Index('userid', ['userid'])
@Index('type', ['type'])
export class Passenger {
  @PrimaryGeneratedColumn({ type: 'int' })
  passengerid!: number;

  @Column({ type: 'int' })
  userid!: number;

  @Column({ type: 'enum', enum: ['adult', 'child', 'infant'], nullable: true })
  type!: 'adult' | 'child' | 'infant';

  @Column({ type: 'varchar', length: 45, nullable: true })
  title!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  first_name!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  family_name!: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  nationality!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  preference!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  freq_type!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  alfursan_no!: string;

  @Column({ type: 'date', default: () => "'0000-00-00'" })
  dob!: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  id_type!: string;

  @Column({ type: 'varchar', length: 45, default: 'SA' })
  id_issuing_country!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  country_of_birth!: string;

  @Column({ type: 'date' })
  id_expiration!: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  id_number!: string;

  @Column({ type: 'enum', enum: ['active', 'deleted', 'merged'], default: 'active' })
  status!: 'active' | 'deleted' | 'merged';

  @Column({ type: 'enum', enum: ['male', 'female'], nullable: true })
  gender!: 'male' | 'female';

  @Column({ type: 'varchar', length: 200 })
  need_assistant!: string;

  @Column({ type: 'varchar', length: 255 })
  passport_number!: string;

  @Column({ type: 'varchar', length: 255 })
  passport_issuing_country!: string;

  @Column({ type: 'date' })
  passport_expiration!: Date;

  @Column({ type: 'tinyint' })
  passport_only!: number;

  @Column({ type: 'int' })
  used_counter!: number;

  @Column({ type: 'varchar', length: 250, default: 'flyakeed' })
  origin!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date_created!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_updated!: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  hotel_nationality!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  hotel_residence!: string;
}
