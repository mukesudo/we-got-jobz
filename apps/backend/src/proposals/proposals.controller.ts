import { Controller, Get, Param } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.proposalsService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.proposalsService.findOne(id);
  }

  @Get('/job/:jobId')
  @AllowAnonymous()
  findByJob(@Param('jobId') jobId: string) {
    return this.proposalsService.findByJob(jobId);
  }

  @Get('/talent/:talentId')
  @AllowAnonymous()
  findByTalent(@Param('talentId') talentId: string) {
    return this.proposalsService.findByTalent(talentId);
  }
}
