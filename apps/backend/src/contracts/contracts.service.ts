import { Injectable } from '@nestjs/common';

export type ContractStatus = 'active' | 'completed' | 'canceled';

export interface Contract {
  id: string;
  jobId: string;
  talentId: string;
  proposalId: string;
  totalAmount: number;
  currency: string;
  status: ContractStatus;
  createdAt: string;
}

@Injectable()
export class ContractsService {
  private readonly contracts: Contract[] = [
    {
      id: 'contract_1',
      jobId: 'job_1',
      talentId: 'talent_1',
      proposalId: 'proposal_1',
      totalAmount: 900,
      currency: 'USD',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];

  findAll() {
    return this.contracts;
  }

  findOne(id: string) {
    return this.contracts.find((c) => c.id === id) ?? null;
  }

  findByJob(jobId: string) {
    return this.contracts.filter((c) => c.jobId === jobId);
  }

  findByTalent(talentId: string) {
    return this.contracts.filter((c) => c.talentId === talentId);
  }
}
