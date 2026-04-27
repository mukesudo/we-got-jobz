import { api } from './api';

export interface TalentFilters {
  skills?: string;
  q?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  sort?: 'rating' | 'rate_asc' | 'rate_desc' | 'newest';
}

export const TalentService = {
  getAll: async (filters: TalentFilters = {}) => {
    const params: Record<string, string> = {};
    if (filters.skills) params.skills = filters.skills;
    if (filters.q) params.q = filters.q;
    if (filters.minRate !== undefined) params.minRate = String(filters.minRate);
    if (filters.maxRate !== undefined) params.maxRate = String(filters.maxRate);
    if (filters.minRating !== undefined) params.minRating = String(filters.minRating);
    if (filters.sort) params.sort = filters.sort;
    const response = await api.get('/talent', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/talent/${id}`);
    return response.data;
  },
};
