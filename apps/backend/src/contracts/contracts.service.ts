import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contract.findMany();
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async findByJob(jobId: string) {
    return this.prisma.contract.findMany({ where: { projectId: jobId } });
  }

  async findByTalent(freelancerId: string) {
    return this.prisma.contract.findMany({ where: { freelancerId } });
  }
}
