import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '@rpa/shared';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
      timestamp,
    };
    return res.status(err.statusCode).json(response);
  }

  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.errors[0].message,
      },
      timestamp,
    };
    return res.status(400).json(response);
  }

  // 예상치 못한 에러
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error('Unexpected error:', message, err);

  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? message
          : 'An unexpected error occurred',
    },
    timestamp,
  };
  return res.status(500).json(response);
};
