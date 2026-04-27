import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@we-got-jobz/db';
@Injectable()
export class TalentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    skills?: string;
    q?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
    sort?: 'rating' | 'rate_asc' | 'rate_desc' | 'newest';
  }) {
    const profileWhere: any = {};

    if (filters?.skills) {
      const skillsArray = filters.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
      if (skillsArray.length > 0) {
        profileWhere.skills = {
          some: {
            name: {
              in: skillsArray,
              mode: 'insensitive',
            },
          },
        };
      }
    }

    if (filters?.minRate !== undefined || filters?.maxRate !== undefined) {
      profileWhere.hourlyRate = {};
      if (filters?.minRate !== undefined)
        profileWhere.hourlyRate.gte = filters.minRate;
      if (filters?.maxRate !== undefined)
        profileWhere.hourlyRate.lte = filters.maxRate;
    }

    if (filters?.minRating !== undefined) {
      profileWhere.rating = { gte: filters.minRating };
    }

    const where: any = {
      role: UserRole.FREELANCER,
      freelancerProfile: { isNot: null, ...profileWhere },
    };

    if (filters?.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        {
          freelancerProfile: {
            title: { contains: filters.q, mode: 'insensitive' },
          },
        },
        {
          freelancerProfile: {
            bio: { contains: filters.q, mode: 'insensitive' },
          },
        },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (filters?.sort) {
      case 'rating':
        orderBy = { freelancerProfile: { rating: 'desc' } };
        break;
      case 'rate_asc':
        orderBy = { freelancerProfile: { hourlyRate: 'asc' } };
        break;
      case 'rate_desc':
        orderBy = { freelancerProfile: { hourlyRate: 'desc' } };
        break;
    }

    return this.prisma.user.findMany({
      where,
      orderBy,
      include: {
        freelancerProfile: {
          include: { skills: true },
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
