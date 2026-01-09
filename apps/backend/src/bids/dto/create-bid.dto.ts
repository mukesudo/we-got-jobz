import { IsString, IsNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  proposedAmount: number;

  @IsString()
  proposedTimeline: string;

  @IsString()
  coverLetter: string;
}
