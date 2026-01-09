import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    senderId: string,
    receiverId: string,
    content: string,
    projectId?: string,
  ) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        projectId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async findByProject(projectId: string, skip: number = 0, take: number = 50) {
    return this.prisma.message.findMany({
      where: { projectId },
      skip,
      take,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(messageId: string) {
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
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
