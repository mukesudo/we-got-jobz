import { IsString, IsOptional } from 'class-validator';

export class CreateClientProfileDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
