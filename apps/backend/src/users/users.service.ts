import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });
  }

  async updateUser(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });
  }

  async deactivateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async activateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }

  async getMyStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return null;
    }

    const unreadMessagesPromise = this.prisma.message.count({
      where: { receiverId: userId, isRead: false },
    });

    const walletPromise = this.prisma.wallet.findUnique({
      where: { userId },
      select: { balance: true },
    });

    if (user.role === UserRole.CLIENT) {
      const [jobsPosted, openJobs, inProgressJobs, activeContracts, unreadMessages, wallet] =
        await Promise.all([
          this.prisma.project.count({ where: { clientId: userId } }),
          this.prisma.project.count({ where: { clientId: userId, status: 'OPEN' } }),
          this.prisma.project.count({
            where: { clientId: userId, status: 'IN_PROGRESS' },
          }),
          this.prisma.contract.count({
            where: { clientId: userId, status: 'ACTIVE' },
          }),
          unreadMessagesPromise,
          walletPromise,
        ]);

      return {
        role: user.role,
        stats: {
          jobsPosted,
          openJobs,
          inProgressJobs,
          activeContracts,
          unreadMessages,
          walletBalance: wallet?.balance ?? 0,
        },
      };
    }

    const [activeBids, acceptedBids, activeContracts, completedContracts, unreadMessages, wallet] =
      await Promise.all([
        this.prisma.bid.count({ where: { freelancerId: userId, status: 'PENDING' } }),
        this.prisma.bid.count({ where: { freelancerId: userId, status: 'ACCEPTED' } }),
        this.prisma.contract.count({
          where: { freelancerId: userId, status: 'ACTIVE' },
        }),
        this.prisma.contract.count({
          where: { freelancerId: userId, status: 'COMPLETED' },
        }),
        unreadMessagesPromise,
        walletPromise,
      ]);

    return {
      role: user.role,
      stats: {
        activeBids,
        acceptedBids,
        activeContracts,
        completedContracts,
        unreadMessages,
        walletBalance: wallet?.balance ?? 0,
      },
    };
  }
}
