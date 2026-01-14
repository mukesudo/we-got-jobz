
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole, ContractStatus, Contract } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async getDisputedContracts() {
    return this.prisma.contract.findMany({
      where: {
        status: 'DISPUTED',
      },
      include: {
        project: true,
        client: true,
        freelancer: true,
      },
    });
  }

  async getDisputedContractById(id: string): Promise<Contract | null> {
    return this.prisma.contract.findUnique({
      where: { id, status: 'DISPUTED' },
      include: {
        project: true,
        client: true,
        freelancer: true,
        reviews: true,
        milestones: true,
      },
    });
  }

  async updateContractStatus(id: string, status: ContractStatus): Promise<Contract> {
    return this.prisma.contract.update({
      where: { id },
      data: { status },
    });
  }
}
