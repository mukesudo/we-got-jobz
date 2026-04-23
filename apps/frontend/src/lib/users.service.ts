import { api } from '@/lib/api';
import { User } from '@/lib';

export interface UserStatsResponse {
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  stats: Record<string, number>;
}

export const UsersService = {
  async getMe() {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async getMyStats() {
    const { data } = await api.get<UserStatsResponse>('/users/me/stats');
    return data;
  },

  async getProfile(id: string) {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async updateProfile(userData: Partial<User>) {
    const { data } = await api.patch<User>('/users/me', userData);
    return data;
  },
};
