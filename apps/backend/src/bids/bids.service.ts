import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidsService {
  constructor(private readonly prisma: PrismaService) {}

  findByProject(projectId: string) {
    return this.prisma.bid.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        freelancer: {
          include: {
            freelancerProfile: true,
          },
        },
        project: true,
      },
    });
  }

  findByFreelancer(freelancerId: string) {
    return this.prisma.bid.findMany({
      where: { freelancerId },
      orderBy: { createdAt: 'desc' },
      include: {
        project: true,
      },
    });
  }

  async create(freelancerId: string, projectId: string, data: CreateBidDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const createData = {
      amount: data.proposedAmount,
      coverLetter: data.coverLetter,
      estimatedHours: isNaN(Number(data.proposedTimeline)) ? undefined : Number(data.proposedTimeline),
      freelancerId,
      projectId,
    } as any;

    return this.prisma.bid.create({
      data: createData,
      include: {
        freelancer: true,
        project: true,
      },
    });
  }
}
