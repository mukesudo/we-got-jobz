import { Injectable } from '@nestjs/common';

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  jobId: string;
  talentId: string;
  coverLetter: string;
  proposedAmount: number;
  currency: string;
  status: ProposalStatus;
  createdAt: string;
}

@Injectable()
export class ProposalsService {
  private readonly proposals: Proposal[] = [
    {
      id: 'proposal_1',
      jobId: 'job_1',
      talentId: 'talent_1',
      coverLetter: 'I have built several SaaS apps with Next.js and NestJS.',
      proposedAmount: 900,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'proposal_2',
      jobId: 'job_1',
      talentId: 'talent_2',
      coverLetter: 'I can help refine UX and UI for your marketing site.',
      proposedAmount: 750,
      currency: 'USD',
      status: 'rejected',
      createdAt: new Date().toISOString(),
    },
  ];

  findAll() {
    return this.proposals;
  }

  findOne(id: string) {
    return this.proposals.find((p) => p.id === id) ?? null;
  }

  findByJob(jobId: string) {
    return this.proposals.filter((p) => p.jobId === jobId);
  }

  findByTalent(talentId: string) {
    return this.proposals.filter((p) => p.talentId === talentId);
  }
}
