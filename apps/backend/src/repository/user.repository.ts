import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(email: string, password: string, name: string) {
    return prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async update(id: string, data: Partial<{ name: string; email: string }>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const userRepository = new UserRepository();
