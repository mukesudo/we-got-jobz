import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateJobDto) {
    const createData: any = {
      title: data.title,
      description: data.description,
      budget: data.budget,
      budgetType: data.budgetType,
      clientId: userId,
      status: 'OPEN',
      deadline: null,
      skills: { connect: [] },
    };

    if (data.deadline) createData.deadline = new Date(data.deadline);

    if (data.skills && data.skills.length > 0) {
      createData.skills = {
        connectOrCreate: data.skills.map((name) => ({
          where: { name },
          create: { name },
        })),
      };
    }

    return this.prisma.project.create({
      data: createData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
            clientProfile: true,
          },
        },
        bids: true,
        skills: true,
      },
    });
  }

  async findAll(skip: number = 0, take: number = 10, search?: string) {
    const where: any = { status: 'OPEN' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.project.findMany({
      where,
      skip,
      take,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
            clientProfile: true,
          },
        },
        bids: {
          select: {
            id: true,
            amount: true,
          },
        },
        skills: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        bids: {
          include: {
            freelancer: {
              include: {
                freelancerProfile: true,
              },
            },
          },
        },
        skills: true,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateJobDto) {
    const existing = await this.prisma.project.findUnique({ where: { id }, include: { skills: true } });
    if (!existing) throw new NotFoundException('Job not found');
    if (existing.clientId !== userId) throw new ForbiddenException();

    const updateData: any = { ...data };
    if (data.deadline) updateData.deadline = new Date(data.deadline);
    // Remove skills from direct update and apply in a transaction if present
    const skills = data.skills;
    if (skills) delete updateData.skills;

    let updated = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        bids: true,
        skills: true,
      },
    });

    if (skills) {
      await this.prisma.$transaction([
        this.prisma.project.update({ where: { id }, data: { skills: { set: [] } } }),
        this.prisma.project.update({
          where: { id },
          data: {
            skills: {
              connectOrCreate: skills.map((name) => ({ where: { name }, create: { name } })),
            },
          },
        }),
      ]);

      const found = await this.prisma.project.findUnique({ where: { id }, include: { bids: true, skills: true } });
      if (!found) throw new NotFoundException('Job not found');
      updated = found;
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Job not found');
    if (existing.clientId !== userId) throw new ForbiddenException();

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async findByClient(clientId: string) {
    return this.prisma.project.findMany({
      where: { clientId },
      include: {
        bids: true,
        skills: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
