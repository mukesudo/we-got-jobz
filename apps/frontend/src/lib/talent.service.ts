import { api } from './api';

export const TalentService = {
  getAll: async (skills?: string) => {
    const response = await api.get('/talent', {
      params: { skills },
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/talent/${id}`);
    return response.data;
  },
};
