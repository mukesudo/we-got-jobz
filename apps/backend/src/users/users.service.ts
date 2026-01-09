import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });
  }

  async updateUser(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: {
        freelancerProfile: true,
        clientProfile: true,
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });
  }
}
