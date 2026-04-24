import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { RabbitMqService } from '../integrations/rabbitmq.service';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class BidsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMqService: RabbitMqService,
    private readonly metricsService: MetricsService,
  ) {}

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
      select: { id: true, clientId: true, status: true, title: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.status !== 'OPEN') {
      throw new BadRequestException('Project is not accepting bids');
    }
    if (project.clientId === freelancerId) {
      throw new BadRequestException('You cannot bid on your own project');
    }

    const existingBid = await this.prisma.bid.findUnique({
      where: {
        freelancerId_projectId: {
          freelancerId,
          projectId,
        },
      },
      select: { id: true },
    });

    if (existingBid) {
      throw new ConflictException('You have already submitted a bid for this job');
    }

    const createData = {
      amount: data.amount,
      coverLetter: data.coverLetter ?? null,
      estimatedHours: data.estimatedHours ?? null,
      freelancerId,
      projectId,
    } as any;

    const newBid = await this.prisma.bid.create({
      data: createData,
      include: {
        freelancer: true,
        project: true,
      },
    });

    // Notify client via message
    await this.prisma.message.create({
      data: {
        content: `New proposal received for your job: ${project.title}. Bid amount: $${data.amount}.`,
        senderId: freelancerId,
        receiverId: project.clientId,
        projectId: projectId,
      }
    });

    return newBid;
  }

  async accept(bidId: string, clientId: string) {
    return this.prisma.$transaction(async (tx) => {
      const bid = await tx.bid.findUnique({
        where: { id: bidId },
        include: {
          project: true,
          freelancer: {
            include: { freelancerProfile: true },
          },
        },
      });

      if (!bid) {
        throw new NotFoundException('Bid not found');
      }

      if (bid.project.clientId !== clientId) {
        throw new ForbiddenException('Only the job owner can accept bids');
      }

      if (bid.project.status === 'CANCELLED' || bid.project.status === 'COMPLETED') {
        throw new BadRequestException('Cannot accept bids for this project status');
      }

      await tx.bid.updateMany({
        where: {
          projectId: bid.projectId,
          id: { not: bid.id },
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      });

      const acceptedBid = await tx.bid.update({
        where: { id: bid.id },
        data: { status: 'ACCEPTED' },
        include: {
          project: true,
          freelancer: {
            include: { freelancerProfile: true },
          },
        },
      });

      const existingContract = await tx.contract.findUnique({
        where: { projectId: bid.projectId },
      });

      const contract = existingContract
        ? await tx.contract.update({
            where: { id: existingContract.id },
            data: {
              freelancerId: bid.freelancerId,
              clientId,
              amount: bid.amount,
              status: 'ACTIVE',
              endedAt: null,
            },
          })
        : await tx.contract.create({
            data: {
              projectId: bid.projectId,
              freelancerId: bid.freelancerId,
              clientId,
              amount: bid.amount,
              status: 'ACTIVE',
            },
          });

      await tx.project.update({
        where: { id: bid.projectId },
        data: { status: 'IN_PROGRESS' },
      });

      await this.rabbitMqService.publish('bid.accepted', {
        bidId: acceptedBid.id,
        projectId: acceptedBid.projectId,
        freelancerId: acceptedBid.freelancerId,
        clientId,
        contractId: contract.id,
      });

      // Notify freelancer via message
      await tx.message.create({
        data: {
          content: `Congratulations! Your proposal for ${acceptedBid.project.title} was accepted. A contract has been created. Let's discuss!`,
          senderId: clientId,
          receiverId: acceptedBid.freelancerId,
          projectId: acceptedBid.projectId,
          contractId: contract.id,
        }
      });

      this.metricsService.bidAcceptedCounter.inc();

      return {
        bid: acceptedBid,
        contract,
      };
    });
  }

  async reject(bidId: string, clientId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { project: true },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.project.clientId !== clientId) {
      throw new ForbiddenException('Only the job owner can reject bids');
    }

    if (bid.status === 'ACCEPTED') {
      throw new BadRequestException('Accepted bids cannot be rejected');
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: { status: 'REJECTED' },
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
}
