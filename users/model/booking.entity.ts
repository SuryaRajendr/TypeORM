import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

// Define enums
enum CreatorType {
  User = 'user',
  Admin = 'admin',
  Merchant = 'merchant',
}

enum OneOrRet {
  Oneway = 'oneway',
  Return = 'return',
  Multicity = 'multicity',
}

enum Status {
  Draft = 'draft',
  Waiting = 'waiting',
  Hold = 'hold',
  Cancel = 'cancel',
  Booked = 'booked',
  Expired = 'expired',
  Error = 'error',
  Paid = 'paid',
  Found = 'found',
  Processing = 'processing',
  ForRefund = 'for_refund',
  Ticketed = 'ticketed',
  Refunded = 'refunded',
  Voided = 'voided',
  Pending = 'pending',
}

enum BookingFeesPayment {
  None = '',
  Points = 'points',
  CC = 'cc',
}

enum BookingInterface {
  MobileWeb = 'mobile_web',
  MobileApp = 'mobile_app',
  Desktop = 'desktop',
  MobileIOS = 'mobile_ios',
  MobileAndroid = 'mobile_android',
  Monitoring = 'monitoring',
  Business = 'business',
  Muqeem = 'muqeem',
}

enum SadadStatus {
  New = 'new',
  Processing = 'processing',
  Paid = 'paid',
  NotPaid = 'not_paid',
  NotBooked = 'not_booked',
}

enum VoucherType {
  UserPromo = 'user_promo',
  Reward = 'reward',
  NeomPromo = 'neom_promo',
}

@Entity({ name: 'booking' })
@Index(['userid'])
@Index(['status'])
@Index(['isdeleted'])
@Index(['date'])
@Index(['from'])
@Index(['to'])
@Index(['timeFrom'])
@Index(['timeTo'])
@Index(['discountId'])
export class Booking {
  @PrimaryGeneratedColumn({ name: 'bookingid', type: 'int', unsigned: true })
  bookingid!: number;

  @Column({ name: 'userid', type: 'int', unsigned: true })
  userid!: number;

  @Column({ name: 'creator_id', type: 'int', unsigned: true })
  creatorId!: number;

  @Column({
    name: 'creator_type',
    type: 'enum',
    enum: CreatorType,
  })
  creatorType!: CreatorType;

  @Column({
    name: 'one_or_ret',
    type: 'enum',
    enum: OneOrRet,
    default: OneOrRet.Oneway,
  })
  oneOrRet!: OneOrRet;

  @Column({ name: 'from', type: 'varchar', length: 15 })
  from!: string;

  @Column({ name: 'to', type: 'varchar', length: 15 })
  to!: string;

  @Column({ name: 'total_flight_duration', type: 'varchar', length: 10, nullable: true })
  totalFlightDuration?: string;

  @Column({
    name: 'total_departure_duration',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  totalDepartureDuration?: string;

  @Column({ name: 'total_return_duration', type: 'varchar', length: 10, nullable: true })
  totalReturnDuration?: string;

  @Column({ name: 'adult', type: 'tinyint', unsigned: true, default: 1 })
  adult!: number;

  @Column({ name: 'children', type: 'tinyint', unsigned: true, default: 0 })
  children?: number;

  @Column({ name: 'infant', type: 'tinyint', unsigned: true, default: 0 })
  infant?: number;

  @Column({ name: 'phone1_type', type: 'varchar', length: 255 })
  phone1Type!: string;

  @Column({ name: 'phone1_country', type: 'varchar', length: 25, default: 'None' })
  phone1Country?: string;

  @Column({ name: 'phone1_no', type: 'varchar', length: 25, nullable: true })
  phone1No?: string;

  @Column({ name: 'phone2_type', type: 'varchar', length: 25, nullable: true })
  phone2Type?: string;

  @Column({ name: 'phone2_country', type: 'varchar', length: 25, nullable: true })
  phone2Country?: string;

  @Column({ name: 'phone2_no', type: 'varchar', length: 25, nullable: true })
  phone2No?: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.Waiting,
  })
  status!: Status;

  @Column({ name: 'error_no', type: 'varchar', length: 60, default: '0' })
  errorNo!: string;

  @Column({ name: 'error_msg', type: 'varchar', length: 255, nullable: true })
  errorMsg?: string;

  @Column({ name: 'waiting_hold_time', type: 'varchar', length: 60, nullable: true })
  waitingHoldTime?: string;

  @Column({ name: 'airline_br', type: 'varchar', length: 45, nullable: true })
  airlineBr?: string;

  @Column({ name: 'sadad_ref', type: 'varchar', length: 45, nullable: true })
  sadadRef?: string;

  @Column({ name: 'sadad_deadline', type: 'varchar', length: 40, nullable: true })
  sadadDeadline?: string;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2, nullable: true })
  total?: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'sar' })
  currency!: string;

  @Column({ name: 'preferred_currency', type: 'varchar', length: 3, nullable: true })
  preferredCurrency?: string;

  @Column({ name: 'airline', type: 'varchar', length: 255, default: 'SV' })
  airline!: string;

  @Column({ name: 'operating_code', type: 'varchar', length: 10, nullable: true })
  operatingCode?: string;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate!: Date;

  @Column({ name: 'confirmed_date', type: 'datetime', nullable: true })
  confirmedDate?: Date;

  @Column({ name: 'ticketing_deadline', type: 'datetime' })
  ticketingDeadline!: Date;

  @Column({ name: 'original_ticketing_deadline', type: 'datetime' })
  originalTicketingDeadline!: Date;

  @Column({ name: 'prefrence_priorty', type: 'smallint', unsigned: true, default: 0 })
  prefrencePriorty?: number;

  @Column({ name: 'is_date_range', type: 'tinyint', default: 0 })
  isDateRange?: boolean;

  @Column({ name: 'date', type: 'date', nullable: true })
  date?: Date;

  @Column({ name: 'date_to', type: 'varchar', length: 60, nullable: true })
  dateTo?: string;

  @Column({
    name: 'time_choice',
    type: 'set',
    enum: ['1', '2', '3', '4', '5'],
    nullable: true,
  })
  timeChoice?: string[];

  @Column({ name: 'time_from', type: 'time', nullable: true })
  timeFrom?: string;

  @Column({ name: 'time_to', type: 'time', nullable: true })
  timeTo?: string;

  @Column({ name: 'is_max_price', type: 'tinyint', default: 0 })
  isMaxPrice?: boolean;

  @Column({ name: 'max_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxPrice?: number;

  @Column({ name: 'is_any_cabin', type: 'tinyint', default: 1 })
  isAnyCabin!: boolean;

  @Column({ name: 'cabin', type: 'varchar', length: 255, nullable: true })
  cabin?: string;

  @Column({ name: 'no_of_stops', type: 'tinyint', default: 1 })
  noOfStops!: number;

  @Column({ name: 'is_any_airline', type: 'tinyint', default: 1 })
  isAnyAirline!: boolean;

  @Column({
    name: 'preferred_airline',
    type: 'varchar',
    length: 255,
    default: 'saudi airline',
  })
  preferredAirline!: string;

  @Column({ name: 'internal_website_priorty', type: 'smallint', default: 0 })
  internalWebsitePriorty!: number;

  @Column({ name: 'is_favorite', type: 'tinyint', default: 0 })
  isFavorite?: boolean;

  @Column({ name: 'is_ret_date_range', type: 'tinyint', nullable: true })
  isRetDateRange?: boolean;

  @Column({ name: 'ret_date', type: 'date', nullable: true })
  retDate?: Date;

  @Column({ name: 'ret_date_to', type: 'date', nullable: true })
  retDateTo?: Date;

  @Column({ name: 'is_ret_any_time', type: 'tinyint', nullable: true })
  isRetAnyTime?: boolean;

  @Column({ name: 'ret_time_from', type: 'time', nullable: true })
  retTimeFrom?: string;

  @Column({ name: 'ret_time_to', type: 'time', nullable: true })
  retTimeTo?: string;

  @Column({ name: 'return_id', type: 'int', default: 0 })
  returnId!: number;

  @Column({ name: 'rebook_counter', type: 'int', default: 0 })
  rebookCounter!: number;

  @Column({ name: 'is_ret_row', type: 'int', default: 0 })
  isRetRow!: number;

  @Column({ name: 'booking_fees', type: 'float', default: 0 })
  bookingFees!: number;

  @Column({ name: 'booking_fees_currency', type: 'varchar', length: 3, default: 'SAR' })
  bookingFeesCurrency!: string;

  @Column({ name: 'base_fare', type: 'float' })
  baseFare!: number;

  @Column({ name: 'tax', type: 'float' })
  tax!: number;

  @Column({
    name: 'booking_fees_payment',
    type: 'enum',
    enum: BookingFeesPayment,
  })
  bookingFeesPayment!: BookingFeesPayment;

  @Column({ name: 'code_class', type: 'varchar', length: 25, nullable: true })
  codeClass?: string;

  @Column({
    name: 'isdeleted',
    type: 'enum',
    enum: ['0', '1'],
    default: '0',
  })
  isdeleted!: '0' | '1';

  @Column({
    name: 'booking_interface',
    type: 'enum',
    enum: BookingInterface,
    nullable: true,
  })
  bookingInterface?: BookingInterface;

  @Column({ name: 'is_time_to_next_day', type: 'tinyint', default: 0 })
  isTimeToNextDay?: boolean;

  @Column({ name: 'sms_notification', type: 'tinyint', default: 0 })
  smsNotification?: boolean;

  @Column({ name: 'payg', type: 'tinyint', unsigned: true })
  payg!: number;

  @Column({ name: 'removed_alfursan', type: 'varchar', length: 255, default: 'false' })
  removedAlfursan?: string;

  @Column({ name: 'return_to_waiting', type: 'int', default: 0 })
  returnToWaiting?: number;

  @Column({ name: 'purchase_total', type: 'float', nullable: true })
  purchaseTotal?: number;

  @Column({ name: 'purchase_currency', type: 'varchar', length: 255, default: 'SAR' })
  purchaseCurrency!: string;

  @Column({ name: 'admin_priority', type: 'smallint', nullable: true })
  adminPriority?: number;

  @Column({ name: 'purchase_card', type: 'int', nullable: true })
  purchaseCard?: number;

  @Column({ name: 'browser', type: 'varchar', length: 255, nullable: true })
  browser?: string;

  @Column({ name: 'browser_version', type: 'varchar', length: 255, nullable: true })
  browserVersion?: string;

  @Column({ name: 'os', type: 'varchar', length: 255, nullable: true })
  os?: string;

  @Column({ name: 'device', type: 'varchar', length: 255, nullable: true })
  device?: string;

  @Column({ name: 'max_stop', type: 'tinyint', default: 0 })
  maxStop!: number;

  @Column({ name: 'max_duration', type: 'int', default: 86400000 })
  maxDuration!: number;

  @Column({ name: 'ret_max_stop', type: 'tinyint', nullable: true })
  retMaxStop?: number;

  @Column({ name: 'ret_max_duration', type: 'int', nullable: true })
  retMaxDuration?: number;

  @Column({ name: 'ret_is_time_to_next_day', type: 'tinyint', default: 0 })
  retIsTimeToNextDay!: boolean;

  @Column({ name: 'has_error', type: 'tinyint', default: 0 })
  hasError!: boolean;

  @Column({ name: 'has_credit', type: 'tinyint', nullable: true })
  hasCredit?: boolean;

  @Column({ name: 'is_archive', type: 'tinyint', default: 0 })
  isArchive!: boolean;

  @Column({ name: 'is_purchase', type: 'tinyint', default: 0 })
  isPurchase!: boolean;

  @Column({ name: 'membership_type', type: 'tinyint' })
  membershipType!: number;

  @Column({
    name: 'sadad_status',
    type: 'enum',
    enum: SadadStatus,
    default: SadadStatus.New,
  })
  sadadStatus!: SadadStatus;

  @Column({ name: 'control_number', type: 'varchar', length: 60, nullable: true })
  controlNumber?: string;

  @Column({ name: 'agent_id', type: 'varchar', length: 60, nullable: true })
  agentId?: string;

  @Column({ name: 'iata_code', type: 'varchar', length: 60, nullable: true })
  iataCode?: string;

  @Column({ name: 'office_id', type: 'varchar', length: 60, nullable: true })
  officeId?: string;

  @Column({ name: 'office_city', type: 'varchar', length: 60, nullable: true })
  officeCity?: string;

  @Column({ name: 'gds_processed', type: 'tinyint' })
  gdsProcessed!: number;

  @Column({ name: 'gds_stage', type: 'varchar', length: 60, nullable: true })
  gdsStage?: string;

  @Column({ name: 'gds_process_count', type: 'tinyint' })
  gdsProcessCount!: number;

  @Column({ name: 'ndc_sv_processed', type: 'tinyint' })
  ndcSvProcessed!: number;

  @Column({ name: 'ndc_sv_stage', type: 'varchar', length: 10 })
  ndcSvStage!: string;

  @Column({ name: 'ndc_sv_process_count', type: 'tinyint' })
  ndcSvProcessCount!: number;

  @Column({ name: 'version', type: 'tinyint', default: 3 })
  version!: number;

  @Column({ name: 'discount_id', type: 'int', nullable: true })
  discountId?: number;

  @Column({ name: 'discount_amount', type: 'float', nullable: true })
  discountAmount?: number;

  @Column({ name: 'voucher_code', type: 'varchar', length: 60 })
  voucherCode!: string;

  @Column({
    name: 'voucher_type',
    type: 'enum',
    enum: VoucherType,
  })
  voucherType!: VoucherType;

  @Column({ name: 'supplier', type: 'varchar', length: 60 })
  supplier!: string;

  @Column({ name: 'supplier_env', type: 'varchar', length: 60 })
  supplierEnv!: string;

  @Column({ name: 'payment_gateway', type: 'varchar', length: 45 })
  paymentGateway!: string;

  @Column({ name: 'payment_gateway_method', type: 'varchar', length: 45, default: 'cc' })
  paymentGatewayMethod!: string;

  @Column({ name: 'bank_id', type: 'int' })
  bankId!: number;

  @Column({ name: 'is_test', type: 'int', default: 0 })
  isTest!: number;

  @Column({ name: 'is_refundable', type: 'int', default: 0 })
  isRefundable!: number;

  @Column({ name: 'is_corporate_offlinebooking', type: 'int' })
  isCorporateOfflineBooking!: number;

  @Column({ name: 'is_alternative', type: 'tinyint' })
  isAlternative!: number;

  @Column({ name: 'purpose_of_travel_id', type: 'text' })
  purposeOfTravelId!: string;

  @Column({ name: 'purpose_of_travel_name', type: 'text' })
  purposeOfTravelName!: string;

  @Column({ name: 'tag', type: 'text', nullable: true })
  tag?: string;

  @Column({ name: 'corporate_id', type: 'int' })
  corporateId!: number;

  @Column({ name: 'corp_employee_note', type: 'varchar', length: 255 })
  corpEmployeeNote!: string;

  @Column({ name: 'discount_id_supplier', type: 'int', nullable: true })
  discountIdSupplier?: number;

  @Column({ name: 'supplier_id', type: 'int' })
  supplierId!: number;
}
