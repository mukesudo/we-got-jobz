import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Bid, BidStatus } from '@prisma/client';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.bid.findMany();
  }

  async findOne(id: string) {
    const bid = await this.prisma.bid.findUnique({ where: { id } });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }

  async findByProject(projectId: string) {
    return this.prisma.bid.findMany({ where: { projectId } });
  }

  async findByTalent(freelancerId: string) {
    return this.prisma.bid.findMany({ where: { freelancerId } });
  }
}
