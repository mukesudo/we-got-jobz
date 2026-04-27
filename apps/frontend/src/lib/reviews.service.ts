import { api } from './api';

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  reviewerId: string;
  reviewedId: string;
  contractId: string;
  projectId?: string | null;
  createdAt: string;
  reviewer?: { id: string; name?: string | null; image?: string | null };
  contract?: { id: string; project?: { id: string; title: string } | null } | null;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

export const ReviewsService = {
  listByContract: async (contractId: string) => {
    const { data } = await api.get<Review[]>(`/contracts/${contractId}/reviews`);
    return data;
  },
  create: async (contractId: string, input: CreateReviewInput) => {
    const { data } = await api.post<Review>(`/contracts/${contractId}/reviews`, input);
    return data;
  },
  listForUser: async (userId: string) => {
    const { data } = await api.get<Review[]>(`/users/${userId}/reviews`);
    return data;
  },
};
