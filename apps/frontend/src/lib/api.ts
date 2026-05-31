import axios from 'axios';
import { ApiResponse } from '@rpa/shared';

const apiClient = axios.create({
  baseURL: '/api',
});

// 요청 인터셉터: 토큰 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  },
);

export const api = {
  // 인증
  signUp: (data: { email: string; password: string; name: string }) =>
    apiClient.post<ApiResponse>('/auth/sign-up', data),

  signIn: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse>('/auth/sign-in', data),

  // 워크플로우
  workflows: {
    list: (page?: number, limit?: number) =>
      apiClient.get('/workflows', { params: { page, limit } }),
    getById: (id: string) => apiClient.get(`/workflows/${id}`),
    create: (data: unknown) => apiClient.post('/workflows', data),
    update: (id: string, data: unknown) =>
      apiClient.put(`/workflows/${id}`, data),
    delete: (id: string) => apiClient.delete(`/workflows/${id}`),
  },
};
