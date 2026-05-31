import { workflowRepository } from '../repository/workflow.repository';
import {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowResponseDto,
} from '../dto/workflow.dto';
import { AppError } from '../middleware/errorHandler';
import { ServiceContext } from '../types';

export class WorkflowService {
  async getWorkflows(
    context: ServiceContext,
    page: number = 1,
    limit: number = 10,
  ) {
    const result = await workflowRepository.findByUserId(
      context.userId,
      page,
      limit,
    );

    return {
      items: result.workflows.map(this.toResponseDto),
      pagination: result.pagination,
    };
  }

  async getWorkflowById(context: ServiceContext, id: string) {
    const workflow = await workflowRepository.findById(id);
    if (!workflow) {
      throw new AppError('NOT_FOUND', 'Workflow not found', 404);
    }

    if (workflow.userId !== context.userId) {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    return this.toResponseDto(workflow);
  }

  async createWorkflow(
    context: ServiceContext,
    request: CreateWorkflowRequest,
  ) {
    const workflow = await workflowRepository.create({
      name: request.name,
      description: request.description,
      definition: request.definition,
      userId: context.userId,
    });

    return this.toResponseDto(workflow);
  }

  async updateWorkflow(
    context: ServiceContext,
    id: string,
    request: UpdateWorkflowRequest,
  ) {
    const workflow = await workflowRepository.findById(id);
    if (!workflow) {
      throw new AppError('NOT_FOUND', 'Workflow not found', 404);
    }

    if (workflow.userId !== context.userId) {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    const updated = await workflowRepository.update(id, {
      name: request.name,
      description: request.description,
      definition: request.definition,
    });

    return this.toResponseDto(updated);
  }

  async deleteWorkflow(context: ServiceContext, id: string) {
    const workflow = await workflowRepository.findById(id);
    if (!workflow) {
      throw new AppError('NOT_FOUND', 'Workflow not found', 404);
    }

    if (workflow.userId !== context.userId) {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    await workflowRepository.delete(id);
  }

  private toResponseDto(workflow: any): WorkflowResponseDto {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
      isActive: workflow.isActive,
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString(),
    };
  }
}

export const workflowService = new WorkflowService();
