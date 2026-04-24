import { Global, Module } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq.service';
import { EmailWorkerService } from './email-worker.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [RabbitMqService, EmailWorkerService],
  exports: [RabbitMqService, EmailWorkerService],
})
export class IntegrationsModule {}
