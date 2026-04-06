import { api } from '@/lib/api';
import { Bid } from '@/lib';

export interface CreateBidDto {
  projectId: string;
  amount: number;
  coverLetter?: string;
  estimatedHours?: number;
}

export const BidsService = {
  async getByJob(jobId: string) {
    const { data } = await api.get<Bid[]>(`/bids/job/${jobId}`);
    return data;
  },

  async create(bidData: CreateBidDto) {
    const { data } = await api.post<Bid>('/bids', bidData);
    return data;
  },

  async accept(id: string) {
    return api.post<Bid>(`/bids/${id}/accept`);
  },

  async reject(id: string) {
    return api.post<Bid>(`/bids/${id}/reject`);
  },
};
