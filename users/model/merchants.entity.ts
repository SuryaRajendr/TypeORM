import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MerchantEmployee } from './merchant-employees.entity';

@Entity({ name: 'merchants' })
export class Merchant {
  @PrimaryGeneratedColumn({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'commercial_name', type: 'varchar', length: 60, nullable: true })
  commercialName: string;

  @Column({ name: 'company_id', type: 'text' })
  companyId: string;

  @Column({ name: 'logo', type: 'text' })
  logo: string;

  @Column({ name: 'default_admin', type: 'text' })
  defaultAdmin: string;

  @OneToMany(() => MerchantEmployee, (merchantEmployee) => merchantEmployee.merchant)
  merchantEmployees: MerchantEmployee[];
}
