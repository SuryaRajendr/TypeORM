import { IsValidSQLColumn, PaginationDto } from '@flyakeed/lambda-core';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export class GetUserInformationReqDto extends PaginationDto {
  @IsInt()
  @Max(100)
  public limit: number;

  @IsValidSQLColumn('select', ['user.userId', 'user.phoneNumber'])
  public select: string;

  @IsValidSQLColumn('sort', ['user.userId', 'userInformation.firstName'])
  public sort: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  public 'user.userId': number;
}
