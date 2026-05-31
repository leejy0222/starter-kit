import { z } from 'zod';

export const CreateWorkflowRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  definition: z.object({}).passthrough(),
});

export type CreateWorkflowRequest = z.infer<typeof CreateWorkflowRequestSchema>;

export const UpdateWorkflowRequestSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  definition: z.object({}).passthrough().optional(),
});

export type UpdateWorkflowRequest = z.infer<typeof UpdateWorkflowRequestSchema>;

export interface WorkflowResponseDto {
  id: string;
  name: string;
  description?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
