import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

enum BudgetType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
}

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  budget: number;

  @IsEnum(BudgetType)
  budgetType: BudgetType;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
