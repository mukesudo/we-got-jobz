import { api } from '@/lib/api';
import { Job } from '@/lib';

export interface CreateJobDto {
  title: string;
  description: string;
  budget: number;
  budgetType: 'FIXED' | 'HOURLY';
  deadline?: string;
  skills: string[];
  categoryId?: string;
}

export const JobsService = {
  async getAll(params?: { search?: string; category?: string; minBudget?: number; maxBudget?: number }) {
    const { data } = await api.get<Job[]>('/jobs', { params });
    return data;
  },

  async getOne(id: string) {
    const { data } = await api.get<Job>(`/jobs/${id}`);
    return data;
  },

  async create(jobData: CreateJobDto) {
    const { data } = await api.post<Job>('/jobs', jobData);
    return data;
  },

  async delete(id: string) {
    return api.delete(`/jobs/${id}`);
  },
};