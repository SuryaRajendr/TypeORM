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
import { GetUserInformationReqDto } from '../dto/getUserInformation.req.dto';
import { IUsersService } from '@apps/users/interfaces/users.service.interface';
import container from '@apps/users/inversify.config';
import { TYPES } from '@apps/users/inversify.types';

const usersService = container.get<IUsersService>(TYPES.Service);
/**
 * Get User information
 * Retrieves all user related information of a specific user
 */
const getUserInformation: APIGatewayProxyHandler = async (
  event: WithQuery<APIGatewayProxyEvent, GetUserInformationReqDto>,
  context,
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Get userId from parameters
  const userId = parseInt(event.pathParameters?.user_id);
  const data = await usersService.getUserInformation(userId, event.queryStringParameters);
  return successResponse({
    data,
  });
};

export const handler = middyfy(getUserInformation, loggerService(appConfig.appName), {
  enableLogger: ['dev', 'local'].includes(appConfig.stage),
  triggerEvent: 'http',
  validatorOptions: {
    queryClassType: GetUserInformationReqDto,
    queryValidationOptions: {
      validator: {
        forbidNonWhitelisted: true,
        whitelist: true,
      },
    },
  },
});
