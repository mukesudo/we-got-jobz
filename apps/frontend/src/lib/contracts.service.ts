import { api } from '@/lib/api';
import { Contract } from '@/lib';

export const ContractsService = {
  async getAll() {
    const { data } = await api.get<Contract[]>('/contracts');
    return data;
  },
  async getMyContracts() {
    const { data } = await api.get<Contract[]>('/contracts/mine');
    return data;
  },
  async getOne(id: string) {
    const { data } = await api.get<Contract>(`/contracts/${id}`);
    return data;
  },
  async updateStatus(id: string, status: Contract['status']) {
    const { data } = await api.patch<Contract>(`/contracts/${id}/status`, { status });
    return data;
  },
  async markComplete(id: string) {
    const { data } = await api.post<Contract>(`/contracts/${id}/complete`);
    return data;
  },
  async raiseDispute(id: string) {
    const { data } = await api.post<Contract>(`/contracts/${id}/dispute`);
    return data;
  },
};
