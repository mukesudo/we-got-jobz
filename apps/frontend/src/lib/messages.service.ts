import { api } from '@/lib/api';
import type { Message } from '@/lib';

export interface CreateMessageDto {
  receiverId: string;
  content: string;
  projectId?: string;
}

export const MessagesService = {
  async list(params?: { projectId?: string; skip?: number; take?: number }) {
    const { data } = await api.get<Message[]>('/messages', { params });
    return data;
  },

  async unread() {
    const { data } = await api.get<Message[]>('/messages/unread');
    return data;
  },

  async create(payload: CreateMessageDto) {
    const { data } = await api.post<Message>('/messages', payload);
    return data;
  },

  async markAsRead(id: string) {
    const { data } = await api.patch<Message>(`/messages/${id}/read`);
    return data;
  },
};
