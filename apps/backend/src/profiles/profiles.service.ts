import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { UserRole } from '@we-got-jobz/db';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createFreelancerProfile(
    userId: string,
    data: CreateFreelancerProfileDto,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.FREELANCER) {
      // Optionally update user role here if this is the intended flow
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.FREELANCER },
      });
    }

    const skillsToConnect = data.skills?.map((name) => ({ name }));
    delete data.skills; // Remove skills from data as it's handled separately

    return this.prisma.freelancerProfile.create({
      data: {
        userId,
        ...data,
        skills: skillsToConnect
          ? {
              connectOrCreate: skillsToConnect.map((skill) => ({
                where: { name: skill.name },
                create: { name: skill.name },
              })),
            }
          : undefined,
      },
      include: { skills: true },
    });
  }

  async updateFreelancerProfile(
    userId: string,
    data: UpdateFreelancerProfileDto,
  ) {
    const skillsToConnect = data.skills?.map((name) => ({ name }));
    delete data.skills;

    return this.prisma.freelancerProfile.update({
      where: { userId },
      data: {
        ...data,
        skills: skillsToConnect
          ? {
              set: [], // Clear existing skills
              connectOrCreate: skillsToConnect.map((skill) => ({
                where: { name: skill.name },
                create: { name: skill.name },
              })),
            }
          : undefined,
      },
      include: { skills: true },
    });
  }

  async createClientProfile(userId: string, data: CreateClientProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.CLIENT) {
      // Optionally update user role here if this is the intended flow
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.CLIENT },
      });
    }
    return this.prisma.clientProfile.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async updateClientProfile(userId: string, data: UpdateClientProfileDto) {
    return this.prisma.clientProfile.update({
      where: { userId },
      data,
    });
  }

  async getFreelancerProfile(userId: string) {
    return this.prisma.freelancerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
        skills: true,
      },
    });
  }

  async getClientProfile(userId: string) {
    return this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsReceived: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return user;
  }
}
