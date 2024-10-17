import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_emails')
@Index('userid', ['userid'])
export class UserEmails {
  @PrimaryGeneratedColumn({ type: 'int' })
  email_id!: number;

  @Column({ type: 'int' })
  userid!: number;

  @Column({ type: 'varchar', length: 60 })
  email!: string;

  @Column({ type: 'enum', enum: ['primary', 'secondary'], default: 'secondary' })
  type!: 'primary' | 'secondary';

  @Column({ type: 'varchar', length: 255 })
  otp_secret!: string;

  @Column({ type: 'tinyint' })
  status!: number;

  @Column({ type: 'tinyint' })
  deleted!: number;

  @Column({ type: 'datetime' })
  date_created!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_updated!: Date;

  @Column({ type: 'datetime' })
  date_verified!: Date;

  @ManyToOne(() => User, (user) => user.emails)
  @JoinColumn({ name: 'userid' })
  user!: User;
}
