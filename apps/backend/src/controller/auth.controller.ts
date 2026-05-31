import { Request, Response } from 'express';
import { SignUpRequestSchema, SignInRequestSchema } from '../dto/auth.dto';
import { authService } from '../service/auth.service';
import { ApiResponse } from '@rpa/shared';

export class AuthController {
  async signUp(req: Request, res: Response) {
    const request = SignUpRequestSchema.parse(req.body);
    const result = await authService.signUp(request);

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json(response);
  }

  async signIn(req: Request, res: Response) {
    const request = SignInRequestSchema.parse(req.body);
    const result = await authService.signIn(request);

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }
}

export const authController = new AuthController();
