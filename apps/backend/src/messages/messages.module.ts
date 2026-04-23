import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagesController } from './messages.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
