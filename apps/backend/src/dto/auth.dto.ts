import { z } from 'zod';

export const SignUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

export const SignInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;

export interface AuthResponseDto {
  id: string;
  email: string;
  name: string;
  token: string;
}
