import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../middleware/errorHandler';

vi.mock('../repository/user.repository', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mock_token'),
  },
}));

vi.mock('../config/env', () => ({
  env: {
    jwtSecret: 'test_secret',
    jwtExpiration: '1h',
  },
}));

import { authService } from '../service/auth.service';
import { userRepository } from '../repository/user.repository';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('새 사용자 등록 성공 시 token 반환', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(userRepository.create).mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.token).toBe('mock_token');
      expect(result.email).toBe('test@example.com');
    });

    it('중복 이메일 시 DUPLICATE_EMAIL 에러 발생', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: 'existing_user',
        email: 'test@example.com',
        name: 'Existing',
        role: 'USER',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.signUp({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test',
        }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('signIn', () => {
    it('올바른 비밀번호로 로그인 성공 시 token 반환', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test',
        role: 'USER',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock_token');
    });

    it('잘못된 비밀번호 시 INVALID_CREDENTIALS 에러', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test',
        role: 'USER',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.signIn({
          email: 'test@example.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(AppError);
    });

    it('존재하지 않는 이메일 시 INVALID_CREDENTIALS 에러', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(
        authService.signIn({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(AppError);
    });
  });
});
