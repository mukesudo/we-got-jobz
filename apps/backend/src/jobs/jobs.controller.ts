import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @AllowAnonymous()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.jobsService.findAll(Number(skip) || 0, Number(take) || 10, search);
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  async create(@Session() session: UserSession, @Body() data: CreateJobDto) {
    if (!session) throw new UnauthorizedException();
    return this.jobsService.create(session.user.id, data);
  }

  @Put(':id')
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() data: UpdateJobDto,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.jobsService.update(id, session.user.id, data);
  }

  @Delete(':id')
  async remove(@Session() session: UserSession, @Param('id') id: string) {
    if (!session) throw new UnauthorizedException();
    return this.jobsService.remove(id, session.user.id);
  }
}
