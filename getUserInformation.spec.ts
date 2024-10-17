import { APIGatewayProxyEventPathParameters } from 'aws-lambda';
import createEvent from 'mock-aws-events';

import { createMockDataSource } from '../helpers/typeormMocker.helper';

import { handler as getUserInformationHandler } from './getUserInformation';
import { UsersService } from 'services/users.service';
import { Booking } from 'model/booking.entity';
import {
  sqlQueryManager,
  ISqlDatabaseService,
  ISecretService,
} from '@flyakeed/lambda-core';
import { DataSource, DataSourceOptions, SelectQueryBuilder } from 'typeorm';

// const mockUsers = [
//     {
//         "userid": "1056",
//         "phone_number": "9054447444",
//         "phone_country": "+63",
//         "phone_verified": "1",
//         "date_created": "2018-05-16 15:00:26",
//         "preferred_lang": "en",
//         "first_name": "Mark Ivan",
//         "last_name": "Berbenzana",
//         "gender": null,
//         "country": null,
//         "image_url": "https:\/\/flyakeedv3objects.s3.eu-west-1.amazonaws.com\/profile\/photos\/4ca82782c5372a547c104929f03fe7a9.png?1574852116517~0.00:0.00:300.00:300.00:false",
//         "account_credit": "0.00",
//         "phone_type": "",
//     },
// ];
const mockBookingsCount = [
  {
    bookings: 1327,
  },
];
/*const mockActiveUserEmail = [
    {
        email: "ivan@leandevinc.com"
    }
];

const mockLoyaltyPoints = [
    {
        "paid": "0",
        "free": "15",
        "total": "15",
        "wallet_point": "35001"
    }
]

const mockPassengersCount = [
    {
        passengers: 70
    }
]

const mockSyncAccounts = [
    {
        "sync_accounts": 1,
    }
]
const mockUnsyncAccounts = [
    {
        "unsync_accounts": 0,
    }
]

const mockMembershipDetails = [
    {
        "membership_name": "HAWK VIP",
        "amount": "990",
        "duration": "1 year",
        "priority_level": "2",
        "is_ticket": "1",
        "status": "1",
        "name": "Akeed Miles Membership",
        "description": "Akeed Miles Membership",
        "is_active": "1",
        "date_start": "2019-12-02",
        "date_end": "2021-03-02",
        "user_membership_id": "2199"
    }
]

const mockuserEmails = [
    {
        "email_id": "17611",
        "email": "ivank@leandevinc.com",
        "type": "primary",
        "status": "1",
        "deleted": "1",
        "date_created": "2024-05-08 11:06:20",
        "date_updated": "2024-05-08 11:06:20",
        "date_verified": "0000-00-00 00:00:00"
    },
    {
        "email_id": "17612",
        "email": "ivank@leandevinc.coms",
        "type": "primary",
        "status": "1",
        "deleted": "0",
        "date_created": "2024-05-08 12:36:46",
        "date_updated": "2024-05-08 12:36:46",
        "date_verified": "0000-00-00 00:00:00"
    }
]
const mockIsHawk = [
    {
        "is_hawk": 0,
    }
]

const mockWalletMoney = [
    {
        "amount": "999999834391.75"
    }
]

const mockIsCards = [
    {
        "is_cards": 3,
    }
]

const mockHasMerchant = [
    {
        "hasMerchant": 1
    }
]

const mockUserInformation = {
    mockUsers,
    mockBookingsCount,
    mockActiveUserEmail,
    mockLoyaltyPoints,
    mockPassengersCount,
    mockSyncAccounts,
    mockUnsyncAccounts,
    mockMembershipDetails,
    mockuserEmails,
    mockIsHawk,
    mockWalletMoney,
    mockIsCards,
    mockHasMerchant
}

const path1: APIGatewayProxyEventPathParameters = {
    user_id: '1056',
};
*/
jest.mock('./sqlQueryManager', () => ({
  sqlQueryManager: jest.fn(),
}));
const mockDataSource = {
  // Mock any methods you might call on DataSource, e.g., initialize, query, etc.
} as unknown as DataSource;

describe('handler getBookingCount', () => {
  let service: UsersService;
  let mockDbConnection: DataSource;
  let mockQueryBuilder: SelectQueryBuilder<Booking>;
  let mockDbService: jest.Mocked<ISqlDatabaseService>;
  let mockSecretService: jest.Mocked<ISecretService>;

  beforeEach(() => {
    // Option 1: Mock all methods if ISqlDatabaseService has more methods
    mockDbService = {
      getDbConnection: jest.fn(),
      initDataSource: jest.fn(), // Example additional method
      getConnection: jest.fn(), // Example additional method
    } as jest.Mocked<ISqlDatabaseService>;

    // Option 2: Use partial mocking if you don't need all methods
    mockDbService = {
      getDbConnection: jest.fn(),
    } as unknown as jest.Mocked<ISqlDatabaseService>;

    mockSecretService = {
      someMethod: jest.fn(),
    } as unknown as jest.Mocked<ISecretService>;

    service = new UsersService(mockDbService, mockSecretService);

    mockDbConnection = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn(),
      }),
    } as unknown as DataSource;

    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getCount: jest.fn(),
    } as unknown as SelectQueryBuilder<Booking>;

    mockDbService.getConnection.mockResolvedValue(mockDbConnection);
    (
      mockDbConnection.getRepository(Booking).createQueryBuilder as jest.Mock
    ).mockReturnValue(mockQueryBuilder);
  });

  it('should return the correct booking count', async () => {
    // const mockSqlQueryResult = { select: 'some_select_query' };
    // mockSecretService.getSecret.mockReturnValue(mockSqlQueryResult);

    (mockQueryBuilder.getCount as jest.Mock).mockResolvedValue(mockBookingsCount);

    const result = await service.getBookingCount(1, {});

    expect(result).toBe(mockBookingsCount);
    // expect(mockSecretService.someMethod).toHaveBeenCalledWith({});
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('some_select_query');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('userid = :userid', {
      userid: 1,
    });
    expect(mockQueryBuilder.getCount).toHaveBeenCalled();
  });
});

// describe('handler getUserInformation()', () => {
//     it('should return user information', async () => {
//         // jest.spyOn(typeorm, 'DataSource').mockImplementation(
//         //     createMockDataSource({
//         //         repositoryMocks: {
//         //             UserInformationEntity: {
//         //                 countResponse: 4,
//         //                 queryResponse: mockUserInformation,
//         //             },
//         //         },
//         //     }),
//         // );
//         jest.spyOn(UsersService, 'getBookingCount').mockResolvedValue(mockBookingsCount);

//         const apiGatewayEvent = createEvent('aws:apiGateway', {
//             httpMethod: 'GET',
//             pathParameters: path1,
//         });

//         delete apiGatewayEvent.queryStringParameters.name;

//         const expectedOutput = {
//             data: mockUserInformation,
//         };
//         const response = await getUserInformationHandler(apiGatewayEvent, null, null);

//         expect(response).toBeDefined();
//         expect(response.statusCode).toBe(200);
//         expect(JSON.parse(response.body)).toStrictEqual(expectedOutput);
//     });

//     it('should return 404 response', async () => {
//         jest.spyOn(typeorm, 'DataSource').mockImplementation(
//             createMockDataSource({
//                 repositoryMocks: {
//                     UserInformationEntity: {
//                         countResponse: 0,
//                         queryResponse: [],
//                     },
//                 },
//             }),
//         );

//         const apiGatewayEvent = createEvent('aws:apiGateway', {
//             httpMethod: 'GET',
//             pathParameters: path1,
//         });

//         delete apiGatewayEvent.queryStringParameters.name;

//         const response = await getUserInformationHandler(apiGatewayEvent, null, null);

//         expect(response).toBeDefined();
//         expect(response.statusCode).toBe(404);
//     });
// });
