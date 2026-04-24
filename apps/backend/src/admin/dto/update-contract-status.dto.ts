import { IsEnum } from 'class-validator';
import { ContractStatus } from '@we-got-jobz/db';

export class UpdateContractStatusDto {
  @IsEnum(ContractStatus)
  status: ContractStatus;
}
