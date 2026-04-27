import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractStatus } from '@we-got-jobz/db';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contract.findMany({
      include: {
        project: true,
        freelancer: true,
        client: true,
        transactions: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        project: true,
        freelancer: true,
        client: true,
        transactions: true,
        milestones: true,
      },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async findByJob(jobId: string) {
    return this.prisma.contract.findMany({
      where: { projectId: jobId },
      include: { project: true, freelancer: true, client: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findByTalent(freelancerId: string) {
    return this.prisma.contract.findMany({
      where: { freelancerId },
      include: { project: true, freelancer: true, client: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findMine(userId: string) {
    return this.prisma.contract.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      include: { project: true, freelancer: true, client: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async updateStatus(id: string, userId: string, status: ContractStatus) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You cannot update this contract');
    }

    const updateData: { status: ContractStatus; endedAt?: Date | null } = { status };
    if (status === 'COMPLETED' || status === 'TERMINATED') {
      updateData.endedAt = new Date();
    }
    if (status === 'ACTIVE') {
      updateData.endedAt = null;
    }

    return this.prisma.contract.update({
      where: { id },
      data: updateData,
      include: { project: true, freelancer: true, client: true },
    });
  }

  async markComplete(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { milestones: true },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You cannot update this contract');
    }
    if (contract.status === ContractStatus.COMPLETED) {
      return contract;
    }

    // Block if any milestone is still funded but unreleased — those funds
    // need to be approved/rejected explicitly first.
    const lockedInEscrow = contract.milestones.some(
      (m) => m.fundedAt && m.status !== 'RELEASED',
    );
    if (lockedInEscrow) {
      throw new BadRequestException(
        'Some milestones are funded but not yet released. Approve or reject them before completing the contract.',
      );
    }

    const released = contract.milestones
      .filter((m) => m.status === 'RELEASED')
      .reduce((sum, m) => sum + m.amount, 0);
    const remaining = Math.max(0, contract.amount - released);

    return this.prisma.$transaction(async (tx) => {
      // If there's any unpaid amount, settle it now: debit client, credit
      // freelancer, and record matching transactions for the audit trail.
      if (remaining > 0) {
        const clientWallet = await tx.wallet.findUnique({
          where: { userId: contract.clientId },
        });
        if (!clientWallet || clientWallet.balance < remaining) {
          throw new BadRequestException(
            'Client wallet has insufficient funds to complete this contract.',
          );
        }

        const freelancerWallet = await tx.wallet.upsert({
          where: { userId: contract.freelancerId },
          create: { userId: contract.freelancerId, balance: 0 },
          update: {},
        });

        await tx.wallet.update({
          where: { id: clientWallet.id },
          data: { balance: { decrement: remaining } },
        });
        await tx.wallet.update({
          where: { id: freelancerWallet.id },
          data: { balance: { increment: remaining } },
        });

        await tx.transaction.create({
          data: {
            userId: contract.clientId,
            contractId: contract.id,
            amount: remaining,
            type: 'PAYMENT',
            status: 'COMPLETED',
          },
        });
        await tx.transaction.create({
          data: {
            userId: contract.freelancerId,
            contractId: contract.id,
            amount: remaining,
            type: 'PAYMENT',
            status: 'COMPLETED',
          },
        });
      }

      return tx.contract.update({
        where: { id },
        data: {
          status: ContractStatus.COMPLETED,
          endedAt: new Date(),
        },
        include: { project: true, freelancer: true, client: true },
      });
    });
  }

  async raiseDispute(id: string, userId: string) {
    return this.updateStatus(id, userId, ContractStatus.DISPUTED);
  }
}
