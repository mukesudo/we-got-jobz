import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get('/job/:jobId')
  @AllowAnonymous()
  findByJob(@Param('jobId') jobId: string) {
    return this.bidsService.findByProject(jobId);
  }

  @Get('/freelancer/:freelancerId')
  @AllowAnonymous()
  findByFreelancer(@Param('freelancerId') freelancerId: string) {
    return this.bidsService.findByFreelancer(freelancerId);
  }

  @Post()
  async create(
    @Session() session: UserSession,
    @Body() payload: { projectId: string } & CreateBidDto,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.bidsService.create(session.user.id, payload.projectId, payload);
  }
}
