import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { StripeService } from './stripe.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly stripeService: StripeService,
  ) {}

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

  @Get('stripe/config')
  getStripeConfig() {
    return this.stripeService.getPublicConfig();
  }

  @Post('stripe/payment-intent')
  async createPaymentIntent(
    @Session() session: UserSession,
    @Body('amount') amount: number,
    @Body('currency') currency?: string,
    @Body('metadata') metadata?: Record<string, string>,
  ) {
    if (!session?.user?.id) {
      throw new UnauthorizedException();
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }

    return this.stripeService.createPaymentIntent({
      userId: session.user.id,
      amount: parsedAmount,
      currency,
      metadata,
    });
  }
}
