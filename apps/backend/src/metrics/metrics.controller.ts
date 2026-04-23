import { Controller, Get, Res } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  @AllowAnonymous()
  async metrics(@Res() response: Response) {
    response.setHeader('Content-Type', this.metricsService.getContentType());
    response.send(await this.metricsService.getMetrics());
  }
}
