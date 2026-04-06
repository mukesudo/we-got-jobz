import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('summary')
  async getSummary(@Session() session: UserSession) {
    if (!session?.user?.id) {
      throw new UnauthorizedException();
    }
    return this.billingService.getSummary(session.user.id);
  }

  @Post('deposit')
  async deposit(
    @Session() session: UserSession,
    @Body('amount') amount: number,
  ) {
    if (!session?.user?.id) {
      throw new UnauthorizedException();
    }
    return this.billingService.deposit(session.user.id, Number(amount));
  }

  @Post('withdraw')
  async withdraw(
    @Session() session: UserSession,
    @Body('amount') amount: number,
  ) {
    if (!session?.user?.id) {
      throw new UnauthorizedException();
    }
    return this.billingService.withdraw(session.user.id, Number(amount));
  }
}
