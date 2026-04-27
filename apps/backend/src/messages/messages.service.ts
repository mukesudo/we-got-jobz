import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMqService } from '../integrations/rabbitmq.service';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMqService: RabbitMqService,
    private readonly metricsService: MetricsService,
  ) {}

  async create(
    senderId: string,
    receiverId: string,
    content: string,
    projectId?: string,
  ) {
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        projectId,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    await this.rabbitMqService.publish('message.sent', {
      messageId: message.id,
      senderId,
      receiverId,
      projectId: projectId || null,
    });
    this.metricsService.messageSentCounter.inc();

    return message;
  }

  async findByProject(projectId: string, skip: number = 0, take: number = 50) {
    return this.prisma.message.findMany({
      where: { projectId },
      skip,
      take,
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByUser(userId: string, skip: number = 0, take: number = 50) {
    return this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      skip,
      take,
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiverId !== userId) {
      throw new ForbiddenException('You can only update your own messages');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async findUnread(userId: string) {
    return this.prisma.message.findMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
