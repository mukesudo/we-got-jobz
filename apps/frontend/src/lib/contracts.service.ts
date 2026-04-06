import { api } from '@/lib/api';
import { Contract } from '@/lib';

export const ContractsService = {
  async getMyContracts() {
    const { data } = await api.get<Contract[]>('/contracts');
    return data;
  },
  async getOne(id: string) {
    const { data } = await api.get<Contract>(`/contracts/${id}`);
    return data;
  }
};