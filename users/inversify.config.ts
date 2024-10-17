import 'reflect-metadata';
import {
  ISecretService,
  ISqlDatabaseService,
  SecretService,
  SqlDatabaseService,
} from '@flyakeed/lambda-core';
import { Container } from 'inversify';

import { IUsersService } from '@apps/users/interfaces/users.service.interface';
import { TYPES } from '@apps/users/inversify.types';
import { UsersService } from '@apps/users/services/users.service';

const container: Container = new Container();

container.bind<IUsersService>(TYPES.Service).to(UsersService);
container.bind<ISecretService>(TYPES.SecretManager).to(SecretService);
container.bind<ISqlDatabaseService>(TYPES.SqlDatabaseService).to(SqlDatabaseService);

export default container;
