import { handlerPathResolver } from '@flyakeed/lambda-core';

/**
 * Enqueue Report
 * Enqueue Report function is for validating and enqueing all report request into sqs queue
 */
export const listUsers = {
  events: [
    {
      http: {
        method: 'get',
        path: 'list-users',
      },
    },
  ],
  handler: `${handlerPathResolver(__dirname)}/functions/listUsers.handler`,
};

export const getUserInformation = {
  events: [
    {
      http: {
        method: 'get',
        path: 'user/information/{user_id}',
      },
    },
  ],
  handler: `${handlerPathResolver(__dirname)}/functions/getUserInformation.handler`,
};
