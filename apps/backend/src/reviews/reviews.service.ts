import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateReviewDto {
  rating: number;
  comment?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Create a review on a completed contract. Either party can review. */
  async createForContract(
    contractId: string,
    reviewerId: string,
    data: CreateReviewDto,
  ) {
    if (
      typeof data?.rating !== 'number' ||
      data.rating < 1 ||
      data.rating > 5
    ) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException('Contract not found');

    if (contract.clientId !== reviewerId && contract.freelancerId !== reviewerId) {
      throw new ForbiddenException('Only the contract parties can leave a review');
    }
    if (contract.status !== 'COMPLETED') {
      throw new BadRequestException(
        'You can only review a contract once it is completed',
      );
    }

    const reviewedId =
      contract.clientId === reviewerId
        ? contract.freelancerId
        : contract.clientId;

    const existing = await this.prisma.review.findFirst({
      where: { contractId, reviewerId },
    });
    if (existing) {
      throw new BadRequestException('You already reviewed this contract');
    }

    const review = await this.prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment?.trim() || null,
        reviewerId,
        reviewedId,
        contractId,
        projectId: contract.projectId,
      },
      include: {
        reviewer: { select: { id: true, name: true, image: true } },
      },
    });

    await this.recomputeFreelancerRating(reviewedId);
    return review;
  }

  /** All reviews for a given user (the reviewed party). */
  async listForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { reviewedId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, name: true, image: true } },
        contract: {
          select: {
            id: true,
            project: { select: { id: true, title: true } },
          },
        },
      },
    });
  }

  /** Reviews tied to a specific contract (visible to its parties). */
  async listForContract(contractId: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('Only the contract parties can view reviews');
    }
    return this.prisma.review.findMany({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, name: true, image: true } },
      },
    });
  }

  /** Recompute aggregate rating on the freelancer profile if applicable. */
  private async recomputeFreelancerRating(userId: string) {
    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });
    if (!profile) return;

    const reviews = await this.prisma.review.findMany({
      where: { reviewedId: userId },
      select: { rating: true },
    });
    const total = reviews.length;
    const avg =
      total === 0
        ? 0
        : reviews.reduce((s, r) => s + r.rating, 0) / total;

    await this.prisma.freelancerProfile.update({
      where: { userId },
      data: {
        rating: Number(avg.toFixed(2)),
        totalReviews: total,
      },
    });
  }
}
