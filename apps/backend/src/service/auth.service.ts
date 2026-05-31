import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repository/user.repository';
import { SignUpRequest, SignInRequest, AuthResponseDto } from '../dto/auth.dto';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';

export class AuthService {
  async signUp(request: SignUpRequest): Promise<AuthResponseDto> {
    const existingUser = await userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new AppError('DUPLICATE_EMAIL', 'Email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const user = await userRepository.create(
      request.email,
      hashedPassword,
      request.name,
    );

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  }

  async signIn(request: SignInRequest): Promise<AuthResponseDto> {
    const user = await userRepository.findByEmail(request.email);
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  }

  private generateToken(id: string, email: string, role: string): string {
    return jwt.sign(
      { id, email, role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiration },
    );
  }
}

export const authService = new AuthService();
