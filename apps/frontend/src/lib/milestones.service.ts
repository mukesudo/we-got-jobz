import { api } from './api';

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'RELEASED'
  | 'REJECTED';

export interface Milestone {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  status: MilestoneStatus;
  contractId: string;
  projectId: string;
  dueDate?: string | null;
  completedAt?: string | null;
  submissionNote?: string | null;
  submissionUrl?: string | null;
  submittedAt?: string | null;
  fundedAt?: string | null;
  releasedAt?: string | null;
  rejectedReason?: string | null;
  createdAt: string;
}

export interface CreateMilestoneInput {
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

export interface SubmitDeliverableInput {
  submissionNote: string;
  submissionUrl?: string;
}

export const MilestonesService = {
  async list(contractId: string) {
    const { data } = await api.get<Milestone[]>(
      `/contracts/${contractId}/milestones`,
    );
    return data;
  },
  async create(contractId: string, input: CreateMilestoneInput) {
    const { data } = await api.post<Milestone>(
      `/contracts/${contractId}/milestones`,
      input,
    );
    return data;
  },
  async fund(milestoneId: string) {
    const { data } = await api.post<Milestone>(
      `/milestones/${milestoneId}/fund`,
    );
    return data;
  },
  async submit(milestoneId: string, input: SubmitDeliverableInput) {
    const { data } = await api.post<Milestone>(
      `/milestones/${milestoneId}/submit`,
      input,
    );
    return data;
  },
  async approve(milestoneId: string) {
    const { data } = await api.post<Milestone>(
      `/milestones/${milestoneId}/approve`,
    );
    return data;
  },
  async reject(milestoneId: string, reason?: string) {
    const { data } = await api.post<Milestone>(
      `/milestones/${milestoneId}/reject`,
      { reason },
    );
    return data;
  },
};
