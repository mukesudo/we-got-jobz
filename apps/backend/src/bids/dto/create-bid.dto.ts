import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}
