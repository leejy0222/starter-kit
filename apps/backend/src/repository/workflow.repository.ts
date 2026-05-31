import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateWorkflowData {
  name: string;
  description?: string;
  definition: Record<string, unknown>;
  userId: string;
}

export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  definition?: Record<string, unknown>;
  status?: string;
  isActive?: boolean;
}

export class WorkflowRepository {
  async findById(id: string) {
    return prisma.workflow.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workflow.count({ where: { userId } }),
    ]);

    return {
      workflows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateWorkflowData) {
    return prisma.workflow.create({
      data,
    });
  }

  async update(id: string, data: UpdateWorkflowData) {
    return prisma.workflow.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.workflow.delete({
      where: { id },
    });
  }
}

export const workflowRepository = new WorkflowRepository();
