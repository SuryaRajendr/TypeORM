import { ObjectLiteral } from '@flyakeed/lambda-core';
import { DataSource } from 'typeorm';

export interface IUsersService {
  getDbConnection(): Promise<DataSource>;
  listUsers(query: ObjectLiteral): Promise<ObjectLiteral>;
  getUserInformation(userId: number, query: ObjectLiteral): Promise<ObjectLiteral>;
}
