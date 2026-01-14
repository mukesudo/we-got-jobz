
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(UserRole)
  role: UserRole;
}
