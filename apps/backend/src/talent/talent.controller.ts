import { Controller, Get, Param } from '@nestjs/common';
import { TalentService } from './talent.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.talentService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.talentService.findOne(id);
  }
}
