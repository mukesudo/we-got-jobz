import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to perform this action.",
          variant: "destructive",
        });
      } else if (error.response?.status >= 500) {
        window.location.href = "/error";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
