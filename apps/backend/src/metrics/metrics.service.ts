import { Injectable } from '@nestjs/common';
import { Counter, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  readonly bidAcceptedCounter = new Counter({
    name: 'wgj_bid_accepted_total',
    help: 'Total number of accepted bids',
    registers: [this.registry],
  });

  readonly messageSentCounter = new Counter({
    name: 'wgj_message_sent_total',
    help: 'Total number of sent messages',
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry });
  }

  getContentType() {
    return this.registry.contentType;
  }

  async getMetrics() {
    return this.registry.metrics();
  }
}
