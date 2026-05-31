import { Response } from 'express';
import {
  CreateWorkflowRequestSchema,
  UpdateWorkflowRequestSchema,
} from '../dto/workflow.dto';
import { workflowService } from '../service/workflow.service';
import { AuthRequest } from '../types';
import { ApiResponse, PaginatedResponse } from '@rpa/shared';

export class WorkflowController {
  async list(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await workflowService.getWorkflows(
      { userId: req.user!.id },
      page,
      limit,
    );

    const response: ApiResponse<PaginatedResponse<unknown>> = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async getById(req: AuthRequest, res: Response) {
    const workflow = await workflowService.getWorkflowById(
      { userId: req.user!.id },
      req.params.id,
    );

    const response: ApiResponse = {
      success: true,
      data: workflow,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async create(req: AuthRequest, res: Response) {
    const request = CreateWorkflowRequestSchema.parse(req.body);
    const workflow = await workflowService.createWorkflow(
      { userId: req.user!.id },
      request,
    );

    const response: ApiResponse = {
      success: true,
      data: workflow,
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json(response);
  }

  async update(req: AuthRequest, res: Response) {
    const request = UpdateWorkflowRequestSchema.parse(req.body);
    const workflow = await workflowService.updateWorkflow(
      { userId: req.user!.id },
      req.params.id,
      request,
    );

    const response: ApiResponse = {
      success: true,
      data: workflow,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async delete(req: AuthRequest, res: Response) {
    await workflowService.deleteWorkflow(
      { userId: req.user!.id },
      req.params.id,
    );

    const response: ApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }
}

export const workflowController = new WorkflowController();
