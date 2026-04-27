import { Controller, Get, Param, Query } from '@nestjs/common';
import { TalentService } from './talent.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get()
  @AllowAnonymous()
  findAll(
    @Query('skills') skills?: string,
    @Query('q') q?: string,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
    @Query('minRating') minRating?: string,
    @Query('sort') sort?: 'rating' | 'rate_asc' | 'rate_desc' | 'newest',
  ) {
    return this.talentService.findAll({
      skills,
      q,
      minRate: minRate !== undefined ? Number(minRate) : undefined,
      maxRate: maxRate !== undefined ? Number(maxRate) : undefined,
      minRating: minRating !== undefined ? Number(minRating) : undefined,
      sort,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.talentService.findOne(id);
  }
}
