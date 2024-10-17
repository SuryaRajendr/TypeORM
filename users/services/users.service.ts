import {
  ISecretService,
  ISqlDatabaseService,
  ObjectLiteral,
  ValidatedSQLQueryResult,
  errorResponse,
  sqlQueryManager,
  successResponse,
  loggerService,
} from '@flyakeed/lambda-core';

import { appConfig } from '@apps/users/config';
import { IUsersService } from '@apps/users/interfaces/users.service.interface';
import { TYPES } from '@apps/users/inversify.types';
import { inject, injectable } from 'inversify';

import { CreditCard } from '../model/credit-card.entity';
import { MembershipType } from '../model/membership-type.entity';
import { MerchantEmployee } from '../model/merchant-employees.entity';
import { Merchant } from '../model/merchants.entity';
import { PaymentCard } from '../model/payment-cards.entity';
import { SubscriptionType } from '../model/subscription-type.entity';
import { UserEmails } from '../model/user-emails.entity';
import { UserMembership } from '../model/user-membership.entity';
import { UserSubscription } from '../model/user-subscription.entity';
import { UserWallet } from '../model/user-wallets.entity';
import { DataSource, DataSourceOptions, SelectQueryBuilder } from 'typeorm';
import { Booking } from '../model/booking.entity';
import { Passenger } from '../model/passenger.entity';
import { SyncAccount } from '../model/sync-accounts.entity';
import { UserInformation } from '../model/user-information.entity';
import { User } from '../model/user.entity';

@injectable()
export class UsersService implements IUsersService {
  private logger;

  constructor(
    @inject(TYPES.SqlDatabaseService) private database: ISqlDatabaseService,
    @inject(TYPES.SecretManager) private secretManager: ISecretService,
  ) {
    this.logger = loggerService(appConfig.appName);
  }

  async getDbConnection(): Promise<DataSource> {
    const dbConnection: DataSource = await this.database.getConnection(async () => {
      try {
        const secret = await this.secretManager.getSecret(appConfig.dbCredSecret);
        const dataSourceOptions = {
          database: secret.database,
          entities: [
            User,
            UserInformation,
            Booking,
            Passenger,
            SyncAccount,
            UserEmails,
            UserMembership,
            MembershipType,
            CreditCard,
            SubscriptionType,
            Merchant,
            MerchantEmployee,
            UserWallet,
            PaymentCard,
            UserSubscription,
          ],
          host: secret.writeHost,
          logging: true,
          name: 'default',
          password: secret.password,
          port: secret.port,
          synchronize: false,
          type: secret.type,
          username: secret.username,
        };

        return dataSourceOptions as DataSourceOptions;
      } catch (error) {
        this.logger.error(`DB Connection Failed`);
      }
    });

    return dbConnection;
  }

  /**
   * List Users
   * List Users function is  for list all users with query params
   */
  async listUsers(query: ObjectLiteral): Promise<ObjectLiteral> {
    const defaultSelect = [
      'user.userId',
      'user.phoneNumber',
      'user.phoneCountry',
      'user.phoneVerified',
      'user.dateCreated',
      'user.preferredLang',
      'userInformation.firstName',
      'userInformation.lastName',
      'userInformation.gender',
      'userInformation.country',
      'userInformation.imageUrl',
      'userInformation.accountCredit',
      'userInformation.phoneType',
      'userInformation.accountCredit',
      "CASE WHEN user.status IN (0, 1) THEN 'active' ELSE 'blocked' END AS userStatus",
      'CASE WHEN (SELECT userid FROM user_membership WHERE userid = user.userid AND is_active = 1 LIMIT 1) IS NULL THEN 0 ELSE 1 END AS isHawk',
    ];
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query, defaultSelect);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<User> = dbConnection
      .getRepository(User)
      .createQueryBuilder('user')
      .select(sqlQuery.select)
      .leftJoin(
        UserInformation,
        'userInformation',
        'userInformation.userId = user.userId',
      )
      .where('user.status IN (:...statuses)', { statuses: [0, 1, 2] });

    Object.keys(sqlQuery.where).forEach((key) => {
      const subKey = key.split('.')[1];

      queryBuilder.andWhere(`${key} = :${subKey}`, { [subKey]: query[key] });
    });

    sqlQuery.sort.forEach((item, index) => {
      if (index === 0) {
        queryBuilder.orderBy(item.key, item.order);
      } else {
        queryBuilder.addOrderBy(item.key, item.order);
      }
    });

    queryBuilder
      .groupBy('user.userId')
      .limit(sqlQuery.limit)
      .offset((sqlQuery.page - 1) * sqlQuery.limit);

    const users: any[] = await queryBuilder.getRawMany();

    return users;
  }

  /**
   * Get User information
   * Retrieves all user related information of a specific user
   * @param userId
   * @param query
   * @returns
   */
  async getUserInformation(userId: number, query: ObjectLiteral): Promise<ObjectLiteral> {
    try {
      // Log this query
      this.logger.info(query);

      // Default select query
      const defaultSelect = [
        'user.userId AS userid',
        'user.phoneNumber AS phone_number',
        'user.phoneCountry AS phone_country',
        'user.phoneVerified AS phone_verified',
        'user.dateCreated AS date_created',
        'user.preferredLang AS preferred_lang',
        'userInformation.firstName AS first_name',
        'userInformation.lastName AS last_name',
        'userInformation.gender AS gender',
        'userInformation.country AS country',
        'userInformation.imageUrl AS image_url',
        'userInformation.accountCredit AS account_credit',
        'userInformation.phoneType AS phone_type',
      ];

      // Prepare query parameters
      const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query, defaultSelect);
      // Connect to database
      const dbConnection: DataSource = await this.getDbConnection();
      //Build query
      const queryBuilder: SelectQueryBuilder<User> = dbConnection
        .getRepository(User)
        .createQueryBuilder('user')
        .select(sqlQuery.select)
        .leftJoin(
          UserInformation,
          'userInformation',
          'userInformation.userId = user.userId',
        )
        .where('user.status != :statuses', { statuses: 2 })
        .andWhere('user.userid = :userid', { userid: userId });

      const users: any[] = await queryBuilder.getRawMany();

      // If user data avaialble proceed to find other information
      if (users) {
        let userInformation = {};

        userInformation = { ...users[0] };

        // Get total booking count of the user
        userInformation['bookings'] = await this.getBookingCount(userId, query);

        // Get active user emails of the user
        const activeUserEmail = await this.getActiveUserEmail(userId);
        // If user has active emails, store the first email entry
        userInformation['email'] = activeUserEmail ? activeUserEmail[0]['email'] : '';

        // Get loyalty points  details of the user
        const loyaltyPoints = await this.getLoyaltyPoints(userId);
        userInformation['loyalty_points'] = loyaltyPoints;

        // Get total passenger count of the user
        userInformation['passengers'] = await this.getActivePassengerCount(userId, query);

        // Get points of the user
        userInformation['points'] = loyaltyPoints;

        // Get linked accounts of the user
        userInformation['sync_accounts'] = await this.getLinkedSyncAccountsCount(
          userId,
          query,
        );

        // Get linked accounts of the user
        userInformation['unsync_accounts'] = await this.getUnlinkedSyncAccountsCount(
          userId,
          query,
        );

        // Get active user membership details of the user
        // Not sure why they have it in the code in php. So currently commented it.
        // userInformation["activeUserMembershipDetails"] = await this.getActiveUserMembershipDetails(userId, query);

        // Get active credit card details of the user
        const activeCreditCardDetails = await this.getActiveCreditCardDetails(userId);
        // If user has active credit cards, store the count of it
        userInformation['is_cards'] = activeCreditCardDetails
          ? activeCreditCardDetails.length
          : 0;

        // Get email list of the user
        userInformation['user_emails'] = await this.getEmailList(userId, query);

        // Get membership details of the user
        userInformation['member_ship_details'] = await this.getMembershipDetails(userId);

        // Check if the user has active hawk membership
        const activeHawkMembership = await this.hasActiveHawkMembership(userId);
        // If user has active hawk membership, mark it as 1
        userInformation['is_hawk'] = activeHawkMembership ? 1 : 0;

        // Get wallet money of the user
        userInformation['wallet_money'] = await this.getWalletMoney(userId);

        // Check if user has merchant configuration
        const hasMerchant = await this.getMerchantEmployeeDetails(userId);
        // If user has merchant configuration, mark it as 1
        userInformation['hasMerchant'] = hasMerchant ? 1 : 0;

        // Returns user information
        return successResponse({ userInformation });
      } else {
        //TODO : log user not found
        return errorResponse({ error: 'User Not found' }, 404);
      }
    } catch (error) {
      return errorResponse(error, 400);
    }
  }

  /**
   * Get Booking count of a specific user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getBookingCount(userId: number, query: ObjectLiteral): Promise<number> {
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<Booking> = dbConnection
      .getRepository(Booking)
      .createQueryBuilder('booking')
      .select(sqlQuery.select)
      .where('userid = :userid', { userid: userId });

    const bookingCount: number = await queryBuilder.getCount();

    return bookingCount;
  }

  /**
   * Get active emails of the specific user
   *
   * @param userId
   * @returns
   */
  async getActiveUserEmail(userId: number): Promise<ObjectLiteral> {
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<UserEmails> = dbConnection
      .getRepository(UserEmails)
      .createQueryBuilder('user_emails')
      .select(['email'])
      .where('userid = :userid', { userid: userId })
      .andWhere('status = :status', { status: 1 })
      .orderBy('type', 'ASC');

    const userEmails: any[] = await queryBuilder.getRawMany();

    return userEmails;
  }

  /**
   * Get active passengers count of a user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getActivePassengerCount(userId: number, query: ObjectLiteral): Promise<number> {
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<Passenger> = dbConnection
      .getRepository(Passenger)
      .createQueryBuilder('passenger')
      .select(sqlQuery.select)
      .where('userid = :userid', { userid: userId })
      .andWhere('status = :status', { status: 'active' });

    const activePassengerCount: number = await queryBuilder.getCount();

    return activePassengerCount;
  }

  /**
   * Get linked accounts of a user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getLinkedSyncAccountsCount(
    userId: number,
    query: ObjectLiteral,
  ): Promise<number> {
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<SyncAccount> = dbConnection
      .getRepository(SyncAccount)
      .createQueryBuilder('sync_accounts')
      .select(sqlQuery.select)
      .where('userid = :userid', { userid: userId })
      .andWhere('status = :status', { status: 1 })
      .andWhere('deleted = :deleted', { deleted: 0 });

    const linkedSyncAccountsCount: number = await queryBuilder.getCount();

    return linkedSyncAccountsCount;
  }

  /**
   * Get unlinked accounts of a user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getUnlinkedSyncAccountsCount(
    userId: number,
    query: ObjectLiteral,
  ): Promise<number> {
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<SyncAccount> = dbConnection
      .getRepository(SyncAccount)
      .createQueryBuilder('sync_accounts')
      .select(sqlQuery.select)
      .where('userid = :userid', { userid: userId })
      .andWhere('status = :status', { status: 0 })
      .andWhere('deleted = :deleted', { deleted: 0 });

    const unlinkedSyncAccountsCount: number = await queryBuilder.getCount();

    return unlinkedSyncAccountsCount;
  }

  /**
   * Get membership details of an active user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getActiveUserMembershipDetails(
    userId: number,
    query: ObjectLiteral,
  ): Promise<ObjectLiteral> {
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<UserMembership> = dbConnection
      .getRepository(UserMembership)
      .createQueryBuilder('user_membership')
      .select(sqlQuery.select)
      .where('userid = :userid', { userid: userId })
      .andWhere('is_active = :is_active', { is_active: 1 });

    const activeUserMembershipDetails: any[] = await queryBuilder.getRawMany();

    return activeUserMembershipDetails;
  }

  /**
   * Get active credit cards of a user
   *
   * @param userId
   * @returns
   */
  async getActiveCreditCardDetails(userId: number): Promise<ObjectLiteral> {
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<CreditCard> = dbConnection
      .getRepository(CreditCard)
      .createQueryBuilder('creditcard')
      .select([
        'credit_cardid',
        'cc_name',
        'cc_number',
        'cc_expiration',
        'cc_cvc',
        'cc_brand',
        'status',
        'used',
        'verified',
        'last_verified',
        'is_primary',
      ])
      .where('userid = :userid', { userid: userId })
      .andWhere('status = :status', { status: 'active' });

    const activeCreditCardDetails: any[] = await queryBuilder.getRawMany();

    return activeCreditCardDetails;
  }

  /**
   * Get email list of a user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getEmailList(userId: number, query: ObjectLiteral): Promise<ObjectLiteral> {
    const sqlQuery: ValidatedSQLQueryResult = sqlQueryManager(query);
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<UserEmails> = dbConnection
      .getRepository(UserEmails)
      .createQueryBuilder('user_emails')
      .select([
        'email_id',
        'email',
        'type',
        'status',
        'deleted',
        'date_created',
        'date_updated',
        'date_verified',
      ])
      .where('userid = :userid', { userid: userId });

    Object.keys(sqlQuery.where).forEach((key) => {
      const subKey = key.split('.')[1];

      queryBuilder.andWhere(`${key} = :${subKey}`, { [subKey]: query[key] });
    });

    sqlQuery.sort.forEach((item, index) => {
      if (index === 0) {
        queryBuilder.orderBy(item.key, item.order);
      } else {
        queryBuilder.addOrderBy(item.key, item.order);
      }
    });

    const userEmails: any[] = await queryBuilder.getRawMany();

    return userEmails;
  }

  /**
   * Get membership details accounts of a user
   *
   * @param userId
   * @returns
   */
  async getMembershipDetails(userId: number): Promise<ObjectLiteral> {
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<UserMembership> = dbConnection
      .getRepository(UserMembership)
      .createQueryBuilder('um')
      .innerJoinAndSelect('um.membershipType', 'mt')
      .innerJoinAndSelect('mt.subscriptionType', 'st')
      .select([
        'mt.membership_name AS membership_name',
        'mt.amount AS amount',
        'mt.duration AS duration',
        'mt.priority_level AS priority_level',
        'mt.is_ticket AS is_ticket',
        'mt.status AS status',
        'st.name AS name',
        'st.description AS description',
        'um.is_active AS is_active',
        'um.date_start AS date_start',
        'um.date_end AS date_end',
        'um.user_membership_id AS user_membership_id',
      ])
      .where('um.is_active != :is_active', { is_active: 2 })
      .andWhere('um.userid = :userid', { userid: userId });

    const userEmails: any[] = await queryBuilder.getRawMany();

    return userEmails;
  }

  /**
   * Check if user has an active hawk membership details or not
   *
   * @param userId
   * @returns
   */
  async hasActiveHawkMembership(userId: number): Promise<ObjectLiteral> {
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<UserMembership> = dbConnection
      .getRepository(UserMembership)
      .createQueryBuilder('user_membership')
      .select('user_membership.userMembershipId', 'user_membership_id')
      .where('user_membership.is_active = :is_active', { is_active: 1 })
      .andWhere(
        "NOW() BETWEEN CONCAT(user_membership.dateStart, ' 00:00:00') AND CONCAT(user_membership.dateEnd, ' 23:59:59')",
      )
      .andWhere('user_membership.userid = :userid', { userid: userId });

    const hasActiveHawkMembership: any[] = await queryBuilder.getRawOne();

    return hasActiveHawkMembership;
  }

  /**
   * Get merchant employee details of a user
   *
   * @param userId
   * @param query
   * @returns
   */
  async getMerchantEmployeeDetails(userId: number): Promise<ObjectLiteral> {
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<MerchantEmployee> = dbConnection
      .getRepository(MerchantEmployee)
      .createQueryBuilder('merchant_employees')
      .innerJoinAndSelect('merchant_employees.merchant', 'merchants')
      .select([
        'merchant_employees.merchantId AS merchant_id',
        'merchants.commercialName AS commercial_name',
        'merchants.companyId AS company_id',
        'merchants.logo AS logo',
        'merchants.defaultAdmin AS default_admin',
      ])
      .where('merchant_employees.userid = :userid', { userid: userId })
      .andWhere('merchant_employees.is_deleted = :is_deleted', { is_deleted: 0 });

    const hasMerchant: any[] = await queryBuilder.getRawMany();

    return hasMerchant;
  }

  /**
   * Get wallet monry of a user
   *
   * @param userId
   * @returns
   */
  async getWalletMoney(userId: number): Promise<number> {
    const dbConnection: DataSource = await this.getDbConnection();
    const walletMoney = await dbConnection.query<any>(
      `
      SELECT
					ROUND(
						(
							SELECT
								IFNULL(SUM(user_wallets.amount), 0)
							FROM
								user_wallets
							WHERE
								userid = ? AND
								user_wallets.type = 'add' AND
								user_wallets.status = 'active' AND
								( user_wallets.expiration_date IS NULL OR user_wallets.expiration_date >= NOW() )
						) -
						(
							SELECT
								IFNULL(SUM(user_wallets.amount), 0)
							FROM
								user_wallets
							LEFT JOIN payment_cards ON payment_cards.payment_id = user_wallets.payment_id
							WHERE
								user_wallets.userid = ? AND
								user_wallets.type = 'sub' AND
								user_wallets.status in ('active') AND
								payment_cards.type NOT IN ('refund_fee','service_fee')
						),
						2
				) as amount;
      `,
      [userId, userId],
    );

    if (walletMoney) {
      walletMoney['amount'] = walletMoney['amount'] < 0 ? 0 : walletMoney['amount'];
    }

    return walletMoney;
  }

  /**
   * Get loyalty points of a user
   *
   * @param userId
   * @param version default = 3
   * @returns
   */
  async getLoyaltyPoints(userId: number, version = 3): Promise<ObjectLiteral> {
    const dbConnection: DataSource = await this.getDbConnection();
    const queryBuilder: SelectQueryBuilder<UserSubscription> = dbConnection
      .getRepository(UserSubscription)
      .createQueryBuilder('us');

    if (version != 3) {
      queryBuilder
        .select([
          "COALESCE(SUM(IF(type = 'add' AND `group` = 'paid', remaining_flight, 0)), 0) AS paid_add",
          "COALESCE(SUM(IF(type = 'sub' AND `group` = 'paid', remaining_flight, 0)), 0) AS paid_sub",
          "COALESCE(SUM(IF(type = 'add' AND `group` = 'free', remaining_flight, 0)), 0) AS free_add",
          "COALESCE(SUM(IF(type = 'sub' AND `group` = 'free', remaining_flight, 0)), 0) AS free_sub",
        ])
        .where('us.userid = :userid', { userid: userId })
        .andWhere('us.status = :status', { status: 'active' });

      const result: SelectQueryBuilder<ObjectLiteral> = dbConnection
        .getRepository(UserSubscription)
        .createQueryBuilder('user_subscription')
        .select([
          '(q.paid_add - q.paid_sub) AS paid',
          '(q.free_add - q.free_sub) AS free',
          '((q.paid_add - q.paid_sub) + (q.free_add - q.free_sub)) AS total',
        ])
        .from(`(${queryBuilder.getQuery()})`, 'q')
        .setParameters(queryBuilder.getParameters());
      const points: any[] = await result.getRawOne();
      //TO-DO Log remaining flight query
      return points;
    } else {
      queryBuilder
        .select([
          "COALESCE(SUM(IF(type = 'add' AND `group` = 'paid', remaining_flight, 0)), 0) AS paid_add",
          "COALESCE(SUM(IF(type = 'sub' AND `group` = 'paid', remaining_flight, 0)), 0) AS paid_sub",
          "COALESCE(SUM(IF(type = 'add' AND `group` = 'free', remaining_flight, 0)), 0) AS free_add",
          "COALESCE(SUM(IF(type = 'sub' AND `group` = 'free', remaining_flight, 0)), 0) AS free_sub",
          "COALESCE(SUM(IF(type = 'add', wallet_point, 0)), 0) AS wallet_add",
          "COALESCE(SUM(IF(type = 'sub', wallet_point, 0)), 0) AS wallet_sub",
        ])
        .where('us.userid = :userid', { userid: userId })
        .andWhere('us.status = :status', { status: 'active' });

      const result: SelectQueryBuilder<ObjectLiteral> = dbConnection
        .getRepository(UserSubscription)
        .createQueryBuilder('user_subscription')
        .select([
          '(q.paid_add - q.paid_sub) AS paid',
          '(q.free_add - q.free_sub) AS free',
          '((q.paid_add - q.paid_sub) + (q.free_add - q.free_sub)) AS total',
          '(q.wallet_add - q.wallet_sub) AS wallet_point',
        ])
        .from(`(${queryBuilder.getQuery()})`, 'q')
        .setParameters(queryBuilder.getParameters());

      const points: any[] = await result.getRawOne();
      //TO-DO Log remaining flight query
      return points;
    }
  }
}
