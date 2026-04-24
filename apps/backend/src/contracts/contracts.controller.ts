import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Contract, ContractStatus } from '@we-got-jobz/db';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @AllowAnonymous()
  async findAll(): Promise<Contract[]> {
    return this.contractsService.findAll();
  }

  @Get('mine')
  async findMine(@Session() session: UserSession): Promise<Contract[]> {
    if (!session) throw new UnauthorizedException();
    return this.contractsService.findMine(session.user.id);
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

  @Patch(':id/status')
  async updateStatus(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body('status') status: ContractStatus,
  ): Promise<Contract> {
    if (!session) throw new UnauthorizedException();
    return this.contractsService.updateStatus(id, session.user.id, status);
  }

  @Post(':id/complete')
  async markComplete(
    @Session() session: UserSession,
    @Param('id') id: string,
  ): Promise<Contract> {
    if (!session) throw new UnauthorizedException();
    return this.contractsService.markComplete(id, session.user.id);
  }

  @Post(':id/dispute')
  async raiseDispute(
    @Session() session: UserSession,
    @Param('id') id: string,
  ): Promise<Contract> {
    if (!session) throw new UnauthorizedException();
    return this.contractsService.raiseDispute(id, session.user.id);
  }
}
