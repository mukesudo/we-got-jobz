import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp, { Channel, Connection } from 'amqplib';
import { PrismaService } from '../prisma/prisma.service';

export interface EmailJobPayload {
  toUserId: string;
  type: 'MARKETING' | 'MESSAGES' | 'JOB_ALERTS' | 'SYSTEM';
  subject: string;
  templateData: Record<string, any>;
}

@Injectable()
export class EmailWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailWorkerService.name);
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private readonly url = process.env.RABBITMQ_URL;
  private readonly exchange = process.env.RABBITMQ_EXCHANGE || 'we_got_jobz.events';
  private readonly queueName = 'email_notifications_queue';

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (!this.url) {
      this.logger.warn('RABBITMQ_URL is not set. Email worker is disabled.');
      return;
    }

    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      
      // Setup the queue
      const q = await this.channel.assertQueue(this.queueName, { durable: true });
      
      // Bind the queue to listen to email events
      await this.channel.bindQueue(q.queue, this.exchange, 'email.*');
      
      this.logger.log(`Email worker connected & listening to queue: ${this.queueName}`);

      // Start consuming
      this.channel.consume(q.queue, async (msg) => {
        if (msg) {
          try {
            const payload = JSON.parse(msg.content.toString()) as EmailJobPayload;
            await this.processEmailJob(payload);
            this.channel?.ack(msg);
          } catch (error) {
            this.logger.error(`Error processing email job:`, error);
            // Nack the message and do not requeue for now (to prevent infinite loops)
            this.channel?.nack(msg, false, false);
          }
        }
      });

    } catch (error) {
      this.logger.error('Failed to connect Email worker to RabbitMQ.', error);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  private async processEmailJob(job: EmailJobPayload) {
    // 1. Fetch user to check notification preferences
    const user = await this.prisma.user.findUnique({
      where: { id: job.toUserId }
    });

    if (!user || !user.email) {
      this.logger.warn(`User ${job.toUserId} not found or has no email.`);
      return;
    }

    // 2. Check notification settings
    if (!user.notificationsEmail && job.type !== 'SYSTEM') {
      this.logger.log(`User ${user.id} has disabled all email notifications.`);
      return;
    }

    if (job.type === 'MARKETING' && !user.notificationsMarketing) {
      this.logger.log(`User ${user.id} opted out of marketing emails.`);
      return;
    }

    if (job.type === 'MESSAGES' && !user.notificationsMessages) {
      this.logger.log(`User ${user.id} opted out of message emails.`);
      return;
    }

    if (job.type === 'JOB_ALERTS' && !user.notificationsJobAlerts) {
      this.logger.log(`User ${user.id} opted out of job alert emails.`);
      return;
    }

    // 3. Render Template
    const htmlBody = this.renderTemplate(job.type, job.templateData);

    // 4. Actually "Send" the email
    // In production, you would use SendGrid, Resend, NodeMailer, AWS SES, etc.
    this.logger.log(`
      ================ SENDING EMAIL ================
      To: ${user.email} (${user.name})
      Subject: ${job.subject}
      Type: ${job.type}
      
      Body:
      ${htmlBody}
      ===============================================
    `);
  }

  private renderTemplate(type: string, data: Record<string, any>): string {
    switch (type) {
      case 'MESSAGES':
        return `
          Hello ${data.recipientName || 'there'},
          
          You have a new message from ${data.senderName || 'someone'} regarding your project.
          
          "${data.messagePreview}"
          
          Log in to We Got Jobz to reply!
        `;
      case 'MARKETING':
        return `
          Hey We Got Jobz Community!
          
          ${data.content}
          
          Thanks for being awesome!
        `;
      case 'JOB_ALERTS':
        return `
          Hello,
          
          A new job matching your skills was just posted:
          ${data.jobTitle} - ${data.budget}
          
          Click here to bid!
        `;
      case 'SYSTEM':
      default:
        return `
          System Notification:
          ${JSON.stringify(data, null, 2)}
        `;
    }
  }
}
