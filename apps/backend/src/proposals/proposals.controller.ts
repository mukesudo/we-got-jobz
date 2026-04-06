import { Controller, Get, Param } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Bid } from '@prisma/client'; // Import Prisma's generated Bid type

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @AllowAnonymous()
  async findAll(): Promise<Bid[]> {
    return this.proposalsService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string): Promise<Bid> {
    return this.proposalsService.findOne(id);
  }

  @Get('/job/:jobId') // Keep the route path as /job/:jobId for external API consistency
  @AllowAnonymous()
  async findByJob(@Param('jobId') jobId: string): Promise<Bid[]> {
    return this.proposalsService.findByProject(jobId); // Call the renamed service method
  }

  @Get('/talent/:talentId')
  @AllowAnonymous()
  async findByTalent(@Param('talentId') talentId: string): Promise<Bid[]> {
    return this.proposalsService.findByTalent(talentId);
  }
}
