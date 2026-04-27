import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateMilestoneDto {
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

export interface SubmitDeliverableDto {
  submissionNote: string;
  submissionUrl?: string;
}

@Injectable()
export class MilestonesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getContractOrThrow(contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async listByContract(contractId: string, userId: string) {
    const contract = await this.getContractOrThrow(contractId);
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('Not a party to this contract');
    }
    return this.prisma.milestone.findMany({
      where: { contractId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(contractId: string, userId: string, data: CreateMilestoneDto) {
    const contract = await this.getContractOrThrow(contractId);
    if (contract.clientId !== userId) {
      throw new ForbiddenException('Only the client can create milestones');
    }
    if (!data.title?.trim()) throw new BadRequestException('Title required');
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new BadRequestException('Amount must be > 0');
    }

    return this.prisma.milestone.create({
      data: {
        title: data.title.trim(),
        description: data.description ?? null,
        amount: data.amount,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        contractId,
        projectId: contract.projectId,
      },
    });
  }

  async fund(milestoneId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findUnique({
        where: { id: milestoneId },
        include: { contract: true },
      });
      if (!milestone) throw new NotFoundException('Milestone not found');
      if (milestone.contract.clientId !== userId) {
        throw new ForbiddenException('Only the client can fund this milestone');
      }
      if (milestone.status !== 'PENDING') {
        throw new BadRequestException('Milestone is not in fundable state');
      }

      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.balance < milestone.amount) {
        throw new BadRequestException(
          'Insufficient wallet balance. Please deposit funds first.',
        );
      }

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: milestone.amount } },
      });

      await tx.transaction.create({
        data: {
          userId,
          contractId: milestone.contractId,
          amount: milestone.amount,
          type: 'PAYMENT',
          status: 'COMPLETED',
        },
      });

      return tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'PENDING',
          fundedAt: new Date(),
        },
      });
    });
  }

  async submitDeliverable(
    milestoneId: string,
    userId: string,
    data: SubmitDeliverableDto,
  ) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: true },
    });
    if (!milestone) throw new NotFoundException('Milestone not found');
    if (milestone.contract.freelancerId !== userId) {
      throw new ForbiddenException('Only the freelancer can submit work');
    }
    if (!milestone.fundedAt) {
      throw new BadRequestException(
        'Milestone must be funded by the client before you can submit work',
      );
    }
    if (!['PENDING', 'REJECTED'].includes(milestone.status)) {
      throw new BadRequestException(
        'You can only submit work on funded milestones awaiting review',
      );
    }
    if (!data.submissionNote?.trim()) {
      throw new BadRequestException('Submission note is required');
    }

    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        submissionNote: data.submissionNote.trim(),
        submissionUrl: data.submissionUrl?.trim() || null,
        submittedAt: new Date(),
        status: 'IN_REVIEW',
        rejectedReason: null,
      },
    });
  }

  async approve(milestoneId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findUnique({
        where: { id: milestoneId },
        include: { contract: true },
      });
      if (!milestone) throw new NotFoundException('Milestone not found');
      if (milestone.contract.clientId !== userId) {
        throw new ForbiddenException('Only the client can approve');
      }
      if (milestone.status !== 'IN_REVIEW' || !milestone.submittedAt) {
        throw new BadRequestException(
          'Milestone must have a submitted deliverable to approve',
        );
      }

      // Release escrow to freelancer
      const freelancerId = milestone.contract.freelancerId;
      let wallet = await tx.wallet.findUnique({
        where: { userId: freelancerId },
      });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId: freelancerId, balance: 0 },
        });
      }
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: milestone.amount } },
      });

      await tx.transaction.create({
        data: {
          userId: freelancerId,
          contractId: milestone.contractId,
          amount: milestone.amount,
          type: 'PAYMENT',
          status: 'COMPLETED',
        },
      });

      const updated = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'RELEASED',
          completedAt: new Date(),
          releasedAt: new Date(),
        },
      });

      // If all milestones for the contract are released, mark contract complete
      const remaining = await tx.milestone.count({
        where: {
          contractId: milestone.contractId,
          status: { notIn: ['RELEASED'] },
        },
      });
      if (remaining === 0) {
        await tx.contract.update({
          where: { id: milestone.contractId },
          data: { status: 'COMPLETED', endedAt: new Date() },
        });
      }

      return updated;
    });
  }

  async reject(milestoneId: string, userId: string, reason?: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: true },
    });
    if (!milestone) throw new NotFoundException('Milestone not found');
    if (milestone.contract.clientId !== userId) {
      throw new ForbiddenException('Only the client can reject');
    }
    if (milestone.status !== 'IN_REVIEW' || !milestone.submittedAt) {
      throw new BadRequestException(
        'Only submitted milestones can be rejected',
      );
    }

    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'REJECTED',
        rejectedReason: reason?.trim() || 'Revisions requested',
      },
    });
  }
}
