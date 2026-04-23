import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractStatus } from '@prisma/client';

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
    return this.updateStatus(id, userId, ContractStatus.COMPLETED);
  }

  async raiseDispute(id: string, userId: string) {
    return this.updateStatus(id, userId, ContractStatus.DISPUTED);
  }
}
