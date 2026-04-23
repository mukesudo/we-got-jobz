import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeService } from './stripe.service';

@Module({
  imports: [PrismaModule],
  providers: [BillingService, StripeService],
  controllers: [BillingController],
})
export class BillingModule {}
