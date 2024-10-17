import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { mockClient } from 'aws-sdk-client-mock';
import createEvent from 'mock-aws-events';

import { handler as listUsersHandler } from '@apps/users/functions/listUsers';

import 'aws-sdk-client-mock-jest';

const secretManagerMock = mockClient(SecretsManagerClient);
const query1: APIGatewayProxyEventQueryStringParameters = {
  randomKey: 'randomValue',
};
const query2: APIGatewayProxyEventQueryStringParameters = {
  limit: '150',
};

beforeAll(() => {
  secretManagerMock
    .on(GetSecretValueCommand)
    .resolves({ SecretString: JSON.stringify({ database: ':memory:', type: 'sqlite' }) });
});

describe('handler listUsers()', () => {
  it('should enqueue return users list', async () => {
    const apiGatewayEvent1 = createEvent('aws:apiGateway', {
      queryStringParameters: query1,
    });
    const apiGatewayEvent2 = createEvent('aws:apiGateway', {
      queryStringParameters: query2,
    });

    delete apiGatewayEvent1.queryStringParameters.name;
    delete apiGatewayEvent2.queryStringParameters.name;

    const users1 = await listUsersHandler(apiGatewayEvent1, null, null);
    const users2 = await listUsersHandler(apiGatewayEvent2, null, null);

    expect(users1).toBeDefined();
    expect(users1.statusCode).toBe(400);

    expect(users2).toBeDefined();
    expect(users2.statusCode).toBe(400);
  });
});
