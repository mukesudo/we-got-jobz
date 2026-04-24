import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@we-got-jobz/db';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateWallet(
    client: Prisma.TransactionClient | PrismaService,
    userId: string,
  ) {
    const existing = await client.wallet.findUnique({ where: { userId } });
    if (existing) return existing;
    return client.wallet.create({
      data: { userId, balance: 0 },
    });
  }

  async getSummary(userId: string) {
    const wallet = await this.getOrCreateWallet(this.prisma, userId);
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return { wallet, transactions };
  }

  async deposit(userId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await this.getOrCreateWallet(tx, userId);
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
        },
      });

      const transactions = await tx.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return { wallet: updatedWallet, transactions };
    });
  }

  async withdraw(userId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await this.getOrCreateWallet(tx, userId);
      if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount,
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
        },
      });

      const transactions = await tx.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return { wallet: updatedWallet, transactions };
    });
  }
}
