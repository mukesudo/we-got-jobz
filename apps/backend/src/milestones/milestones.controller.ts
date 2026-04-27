import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { MilestonesService } from './milestones.service';
import type {
  CreateMilestoneDto,
  SubmitDeliverableDto,
} from './milestones.service';

@Controller()
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get('contracts/:contractId/milestones')
  async list(
    @Session() session: UserSession,
    @Param('contractId') contractId: string,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.milestonesService.listByContract(contractId, session.user.id);
  }

  @Post('contracts/:contractId/milestones')
  async create(
    @Session() session: UserSession,
    @Param('contractId') contractId: string,
    @Body() body: CreateMilestoneDto,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.milestonesService.create(contractId, session.user.id, body);
  }

  @Post('milestones/:id/fund')
  async fund(@Session() session: UserSession, @Param('id') id: string) {
    if (!session) throw new UnauthorizedException();
    return this.milestonesService.fund(id, session.user.id);
  }

  @Post('milestones/:id/submit')
  async submit(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: SubmitDeliverableDto,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.milestonesService.submitDeliverable(id, session.user.id, body);
  }

  @Post('milestones/:id/approve')
  async approve(@Session() session: UserSession, @Param('id') id: string) {
    if (!session) throw new UnauthorizedException();
    return this.milestonesService.approve(id, session.user.id);
  }

  @Post('milestones/:id/reject')
  async reject(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    if (!session) throw new UnauthorizedException();
    return this.milestonesService.reject(id, session.user.id, body?.reason);
  }
}
