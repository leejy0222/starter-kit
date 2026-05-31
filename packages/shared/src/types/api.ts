import { z } from 'zod';

// API 응답 형식 표준화
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }).optional(),
  timestamp: z.string(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
};

// 페이지네이션
export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number(),
  totalPages: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// 페이지네이션된 응답
export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  pagination: PaginationSchema,
});

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};
