import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, ContractStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUserRole(id: string, role: UserRole) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async getDisputedContracts() {
    return this.prisma.contract.findMany({
      where: { status: 'DISPUTED' },
      include: { project: true, freelancer: true, client: true },
    });
  }

  async getDisputedContractById(id: string) {
    return this.prisma.contract.findUnique({
      where: { id },
      include: { project: true, freelancer: true, client: true },
    });
  }

  async updateContractStatus(id: string, status: ContractStatus) {
    return this.prisma.contract.update({ where: { id }, data: { status } });
  }
}
