import { serverlessConfigGenerator } from '@flyakeed/lambda-core';
import type { AWS } from '@serverless/typescript';

import { getUserInformation, listUsers } from '@apps/users';

const serverlessConfiguration: AWS = serverlessConfigGenerator({
  custom: {
    accountId: '${self:custom.${self:provider.stage}.accountId}',
    dev: {
      accountId: '409907163169',
    },
    local: {
      accountId: '000000000000',
    },
    prod: {
      accountId: '351430390034',
    },
    serverlessIfElse: [
      {
        Exclude: ['provider.environment.AWS_REGION'],
        If: '"${self:provider.stage}" != "local"',
      },
    ],
  },
  functions: {
    list: listUsers,
    getUserInformation: getUserInformation,
  },
  plugins: [
    'serverless-plugin-ifelse',
    'serverless-dotenv-plugin',
    'serverless-aws-resource-names',
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    apiGateway: {
      restApiId: 'jeemvlhvj5',
      restApiRootResourceId: '90rwl5fq7d',
    },
    deploymentBucket: {
      name: 'v2-sls-deployment-bucket-${self:provider.stage}',
    },
    environment: {
      AWS_ACCOUNT_ID: "${env:AWS_ACCOUNT_ID,''}",
      AWS_REGION: "${env:AWS_REGION,''}",
    },
    name: 'aws',
    region: 'eu-west-1',
    role: 'arn:aws:iam::${self:custom.accountId}:role/serverless-framwork-lambda-role',
    runtime: 'nodejs16.x',
    stage: "${opt:stage, 'dev'}",
    tracing: {
      lambda: true,
    },
    vpc: {
      securityGroupIds: ['sg-05b011d071072a70d'],
      subnetIds: ['subnet-0c779020197e8884d'],
    },
  },
  service: 'users',
});

module.exports = serverlessConfiguration;
