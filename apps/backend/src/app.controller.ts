// apps/backend/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  @AllowAnonymous() // Allow anonymous access
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
