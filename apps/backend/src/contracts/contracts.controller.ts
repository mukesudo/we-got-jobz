import { Controller, Get, Param } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Contract, ContractStatus } from '@prisma/client'; // Import Prisma's generated Contract type

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @AllowAnonymous()
  async findAll(): Promise<Contract[]> {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string): Promise<Contract> {
    return this.contractsService.findOne(id);
  }

  @Get('/job/:jobId')
  @AllowAnonymous()
  async findByJob(@Param('jobId') jobId: string): Promise<Contract[]> {
    return this.contractsService.findByJob(jobId);
  }

  @Get('/talent/:talentId')
  @AllowAnonymous()
  async findByTalent(@Param('talentId') talentId: string): Promise<Contract[]> {
    return this.contractsService.findByTalent(talentId);
  }
}
