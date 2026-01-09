import { Controller, Get, Param } from '@nestjs/common';
import { ContractsService, Contract } from './contracts.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @AllowAnonymous()
  findAll(): Contract[] {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string): Contract | null {
    return this.contractsService.findOne(id);
  }

  @Get('/job/:jobId')
  @AllowAnonymous()
  findByJob(@Param('jobId') jobId: string): Contract[] {
    return this.contractsService.findByJob(jobId);
  }

  @Get('/talent/:talentId')
  @AllowAnonymous()
  findByTalent(@Param('talentId') talentId: string): Contract[] {
    return this.contractsService.findByTalent(talentId);
  }
}
