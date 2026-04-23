import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp, { Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private readonly url = process.env.RABBITMQ_URL;
  private readonly exchange = process.env.RABBITMQ_EXCHANGE || 'we_got_jobz.events';

  async onModuleInit() {
    if (!this.url) {
      this.logger.warn('RABBITMQ_URL is not set. Event publishing is disabled.');
      return;
    }

    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      this.logger.log(`Connected to RabbitMQ exchange: ${this.exchange}`);
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ. Continuing without broker.', error);
      this.connection = null;
      this.channel = null;
    }
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  isConnected() {
    return !!this.channel;
  }

  async publish(routingKey: string, payload: Record<string, unknown>) {
    if (!this.channel) {
      return false;
    }

    const message = {
      ...payload,
      emittedAt: new Date().toISOString(),
    };

    return this.channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        contentType: 'application/json',
        persistent: true,
      },
    );
  }
}
