import { Controller, Get, Param, Query } from '@nestjs/common';
import { TalentService } from './talent.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query('skills') skills?: string) {
    return this.talentService.findAll(skills);
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.talentService.findOne(id);
  }
}
