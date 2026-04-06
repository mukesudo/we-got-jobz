import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateFreelancerProfileDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[]; // Assuming skills are passed as an array of names

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolio?: string[];

  @IsOptional()
  @IsNumber()
  availability?: number;
}
