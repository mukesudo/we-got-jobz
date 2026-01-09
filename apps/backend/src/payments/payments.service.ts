import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    contractId: string,
    amount: number,
    type: 'PAYMENT' | 'REFUND' | 'DEPOSIT' | 'WITHDRAWAL' | 'FEE' = 'PAYMENT',
  ) {
    // Get the freelancer from the contract to know who receives the payment
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      select: { freelancerId: true },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    return this.prisma.transaction.create({
      data: {
        userId: contract.freelancerId,
        contractId,
        amount,
        type,
        status: 'PENDING',
      },
    });
  }

  async findByContract(contractId: string) {
    return this.prisma.transaction.findMany({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    transactionId: string,
    status: 'PENDING' | 'COMPLETED' | 'FAILED',
  ) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        contract: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDeposit(userId: string, amount: number) {
    return this.prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'DEPOSIT',
        status: 'PENDING',
      },
    });
  }

  async createWithdrawal(userId: string, amount: number) {
    return this.prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'WITHDRAWAL',
        status: 'PENDING',
      },
    });
  }
}
