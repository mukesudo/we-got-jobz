import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '@we-got-jobz/common'; // Changed import
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client'; // Changed to import type

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
    return this.jobsService.findAll(
      Number(skip) || 0,
      Number(take) || 10,
      search,
    );
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  create(@CurrentUser() user: User, @Body() data: CreateJobDto) {
    return this.jobsService.create(user.id, data);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateJobDto,
  ) {
    return this.jobsService.update(id, user.id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.jobsService.remove(id, user.id);
  }
}
