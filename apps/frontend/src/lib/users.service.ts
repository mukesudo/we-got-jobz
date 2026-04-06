import { api } from '@/lib/api';
import { User } from '@/lib';

export const UsersService = {
  async getMe() {
    const { data } = await api.get<User>('/users/me');
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