import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  private readonly stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
  private readonly stripeClient: InstanceType<typeof Stripe> | null;

  constructor() {
    this.stripeClient = this.stripeSecretKey
      ? new Stripe(this.stripeSecretKey)
      : null;
  }

  isEnabled() {
    return !!this.stripeClient;
  }

  getPublicConfig() {
    return {
      enabled: this.isEnabled(),
      publishableKey: this.stripePublishableKey,
    };
  }

  async createPaymentIntent(input: {
    userId: string;
    amount: number;
    currency?: string;
    metadata?: Record<string, string>;
  }) {
    if (!this.stripeClient) {
      throw new ServiceUnavailableException(
        'Stripe is not configured. Set STRIPE_SECRET_KEY.',
      );
    }

    const currency = (input.currency || 'usd').toLowerCase();

    return this.stripeClient.paymentIntents.create({
      amount: Math.round(input.amount),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: input.userId,
        ...(input.metadata || {}),
      },
    });
  }
}
