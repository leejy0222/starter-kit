import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { AppError, errorHandler } from '../middleware/errorHandler';

const createMockRes = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

describe('AppError 클래스', () => {
  it('code, message, statusCode 올바르게 설정', () => {
    const error = new AppError('NOT_FOUND', '리소스 없음', 404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('리소스 없음');
    expect(error.statusCode).toBe(404);
  });

  it('statusCode 기본값은 400', () => {
    const error = new AppError('BAD_REQUEST', '잘못된 요청');
    expect(error.statusCode).toBe(400);
  });
});

describe('errorHandler 미들웨어', () => {
  const req = {} as Request;
  const next = vi.fn() as NextFunction;

  it('AppError 처리 시 올바른 statusCode와 응답 반환', () => {
    const res = createMockRes();
    const error = new AppError('NOT_FOUND', '리소스 없음', 404);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: { code: 'NOT_FOUND', message: '리소스 없음' },
      }),
    );
  });

  it('ZodError 처리 시 VALIDATION_ERROR 코드 반환', () => {
    const res = createMockRes();
    const zodIssue: ZodIssue = {
      code: 'invalid_type',
      expected: 'string',
      received: 'undefined',
      path: ['email'],
      message: '이메일은 필수입니다',
    };
    const zodError = new ZodError([zodIssue]);

    errorHandler(zodError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
      }),
    );
  });
});
