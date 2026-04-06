import { api } from '@/lib/api';
import { User, Contract } from '@/lib';

export const AdminService = {
  async getUsers() {
    const { data } = await api.get<User[]>('/admin/users');
    return data;
  },
  async updateUserRole(id: string, role: User['role']) {
    const { data } = await api.put<User>(`/admin/users/${id}/role`, { role });
    return data;
  },
  async getDisputes() {
    const { data } = await api.get<Contract[]>('/admin/disputes');
    return data;
  },
  async getDisputeById(id: string) {
    const { data } = await api.get<Contract>(`/admin/disputes/${id}`);
    return data;
  },
  async updateDisputeStatus(id: string, status: Contract['status']) {
    const { data } = await api.put<Contract>(`/admin/disputes/${id}/status`, { status });
    return data;
  },
};
