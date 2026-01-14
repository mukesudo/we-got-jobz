import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6) // Example minimum length for password
  password: string;

  @IsString()
  name: string;
}
