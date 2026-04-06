import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
@Injectable()
export class TalentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skills?: string) {
    const where: any = {
      role: UserRole.FREELANCER,
      freelancerProfile: {
        isNot: null,
      },
    };

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      where.freelancerProfile.skills = {
        some: {
          name: {
            in: skillsArray,
            mode: 'insensitive',
          },
        },
      };
    }

    return this.prisma.user.findMany({
      where,
      include: {
        freelancerProfile: {
          include: {
            skills: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
        role: UserRole.FREELANCER,
      },
      include: {
        freelancerProfile: {
          include: {
            skills: true,
          },
        },
      },
    });
  }
}
