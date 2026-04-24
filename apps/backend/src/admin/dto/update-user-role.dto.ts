import { IsEnum } from 'class-validator';
import { UserRole } from '@we-got-jobz/db';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
