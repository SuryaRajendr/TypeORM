import 'reflect-metadata';
import {
  WithQuery,
  loggerService,
  middyfy,
  successResponse,
} from '@flyakeed/lambda-core';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { appConfig } from '@apps/users/config';
import { ListUsersReqDto } from '@apps/users/dto/list.users.req.dto';
import { IUsersService } from '@apps/users/interfaces/users.service.interface';
import container from '@apps/users/inversify.config';
import { TYPES } from '@apps/users/inversify.types';

const usersService = container.get<IUsersService>(TYPES.Service);
/**
 * List Users
 * List Users function is  for list all users with query params
 */
const listUsers: APIGatewayProxyHandler = async (
  event: WithQuery<APIGatewayProxyEvent, ListUsersReqDto>,
  context,
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  const data = await usersService.listUsers(event.queryStringParameters);

  console.log('data', data);

  return successResponse({
    data,
  });
};

export const handler = middyfy(listUsers, loggerService(appConfig.appName), {
  enableLogger: ['dev', 'local'].includes(appConfig.stage),
  triggerEvent: 'http',
  validatorOptions: {
    queryClassType: ListUsersReqDto,
    queryValidationOptions: {
      validator: {
        forbidNonWhitelisted: true,
        whitelist: true,
      },
    },
  },
});
