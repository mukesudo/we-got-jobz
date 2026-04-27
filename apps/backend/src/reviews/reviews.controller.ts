import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ReviewsService } from './reviews.service';
import type { CreateReviewDto } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('contracts/:contractId/reviews')
  async create(
    @Session() session: UserSession,
    @Param('contractId') contractId: string,
    @Body() body: CreateReviewDto,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.reviewsService.createForContract(
      contractId,
      session.user.id,
      body,
    );
  }

  @Get('contracts/:contractId/reviews')
  async listByContract(
    @Session() session: UserSession,
    @Param('contractId') contractId: string,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.reviewsService.listForContract(contractId, session.user.id);
  }

  @Get('users/:userId/reviews')
  @AllowAnonymous()
  async listForUser(@Param('userId') userId: string) {
    return this.reviewsService.listForUser(userId);
  }
}
