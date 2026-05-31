#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const camelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

async function main() {
  const type = process.argv[2];
  const name = process.argv[3];

  if (!type || !name) {
    console.log('📝 사용법:');
    console.log('  claude create page <name>');
    console.log('  claude create component <name>');
    console.log('  claude create api <name>');
    process.exit(1);
  }

  const camelName = camelCase(name);
  const PascalName = capitalize(camelName);

  try {
    if (type === 'page') {
      await createPage(name, PascalName, camelName);
    } else if (type === 'component') {
      await createComponent(name, PascalName, camelName);
    } else if (type === 'api') {
      await createApi(name, camelName);
    } else {
      console.log('❌ 알 수 없는 타입:', type);
      console.log('지원하는 타입: page, component, api');
      process.exit(1);
    }

    console.log('✅ 완료!');
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

async function createPage(name, PascalName, camelName) {
  const pagesDir = path.join(__dirname, '../../apps/frontend/src/pages');
  const filePath = path.join(pagesDir, `${PascalName}.tsx`);

  const template = `import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApiQuery } from '@/lib/useApi';
import { Button } from '@/components/ui';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { api } from '@/lib/api';

interface ${PascalName}Item {
  id: string;
  name: string;
  createdAt: string;
}

export const ${PascalName} = () => {
  const { data, isLoading, refetch } = useApiQuery(() =>
    api.${camelName}.list?.() || Promise.resolve({ data: { success: true, data: [] } }),
    { showErrorToast: true },
  );

  const items = (data || []) as ${PascalName}Item[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ${PascalName} 관리
          </h1>
          <p className="text-gray-600 mt-1">
            ${PascalName} 목록을 관리하세요
          </p>
        </div>
        <Link to="/${camelName}/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 ${PascalName}
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>${PascalName} 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                생성된 ${PascalName}가 없습니다.
              </p>
              <Link to="/${camelName}/new">
                <Button>첫 번째 ${PascalName} 생성</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString(
                          'ko-KR',
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={\`/${camelName}/\${item.id}\`}>
                          <Button
                            variant="secondary"
                            size="sm"
                          >
                            보기
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
`;

  fs.mkdirSync(pagesDir, { recursive: true });
  fs.writeFileSync(filePath, template);
  console.log(`✅ 페이지 생성: ${filePath}`);
}

async function createComponent(name, PascalName, camelName) {
  const componentsDir = path.join(__dirname, '../../apps/frontend/src/components');
  const filePath = path.join(componentsDir, `${PascalName}.tsx`);

  const template = `import React from 'react';
import clsx from 'clsx';

interface ${PascalName}Props
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ${PascalName} = React.forwardRef<
  HTMLDivElement,
  ${PascalName}Props
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('', className)} {...props} />
));

${PascalName}.displayName = '${PascalName}';
`;

  fs.mkdirSync(componentsDir, { recursive: true });
  fs.writeFileSync(filePath, template);
  console.log(`✅ 컴포넌트 생성: ${filePath}`);
}

async function createApi(name, camelName) {
  const dtoPath = path.join(
    __dirname,
    `../../apps/backend/src/dto/${camelName}.dto.ts`
  );
  const repoPath = path.join(
    __dirname,
    `../../apps/backend/src/repository/${camelName}.repository.ts`
  );
  const servicePath = path.join(
    __dirname,
    `../../apps/backend/src/service/${camelName}.service.ts`
  );
  const controllerPath = path.join(
    __dirname,
    `../../apps/backend/src/controller/${camelName}.controller.ts`
  );
  const routesPath = path.join(
    __dirname,
    `../../apps/backend/src/routes/${camelName}.routes.ts`
  );

  // DTO
  const dtoTemplate = `import { z } from 'zod';

export const Create${capitalize(camelName)}Schema = z.object({
  name: z.string().min(1, '이름은 필수입니다'),
});

export type Create${capitalize(camelName)}Request = z.infer<typeof Create${capitalize(camelName)}Schema>;

export interface ${capitalize(camelName)}ResponseDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
`;

  // Repository
  const repoTemplate = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ${capitalize(camelName)}Repository {
  async findMany(userId: string) {
    return prisma.${camelName}.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.${camelName}.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return prisma.${camelName}.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.${camelName}.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.${camelName}.delete({
      where: { id },
    });
  }
}

export const ${camelName}Repository = new ${capitalize(camelName)}Repository();
`;

  // Service
  const serviceTemplate = `import { ${capitalize(camelName)}Repository } from '../repository/${camelName}.repository';
import { Create${capitalize(camelName)}Request } from '../dto/${camelName}.dto';
import { AppError } from '../middleware/errorHandler';
import { ServiceContext } from '../types';

export class ${capitalize(camelName)}Service {
  async get${capitalize(camelName)}s(context: ServiceContext) {
    return ${camelName}Repository.findMany(context.userId);
  }

  async get${capitalize(camelName)}ById(context: ServiceContext, id: string) {
    const item = await ${camelName}Repository.findById(id);
    if (!item) {
      throw new AppError('NOT_FOUND', '항목을 찾을 수 없습니다', 404);
    }
    if ((item as any).userId !== context.userId) {
      throw new AppError('FORBIDDEN', '접근 권한이 없습니다', 403);
    }
    return item;
  }

  async create${capitalize(camelName)}(
    context: ServiceContext,
    request: Create${capitalize(camelName)}Request,
  ) {
    return ${camelName}Repository.create({
      name: request.name,
      userId: context.userId,
    });
  }

  async update${capitalize(camelName)}(
    context: ServiceContext,
    id: string,
    request: Partial<Create${capitalize(camelName)}Request>,
  ) {
    const item = await ${camelName}Repository.findById(id);
    if (!item) {
      throw new AppError('NOT_FOUND', '항목을 찾을 수 없습니다', 404);
    }
    if ((item as any).userId !== context.userId) {
      throw new AppError('FORBIDDEN', '접근 권한이 없습니다', 403);
    }
    return ${camelName}Repository.update(id, request);
  }

  async delete${capitalize(camelName)}(context: ServiceContext, id: string) {
    const item = await ${camelName}Repository.findById(id);
    if (!item) {
      throw new AppError('NOT_FOUND', '항목을 찾을 수 없습니다', 404);
    }
    if ((item as any).userId !== context.userId) {
      throw new AppError('FORBIDDEN', '접근 권한이 없습니다', 403);
    }
    await ${camelName}Repository.delete(id);
  }
}

export const ${camelName}Service = new ${capitalize(camelName)}Service();
`;

  // Controller
  const controllerTemplate = `import { Response } from 'express';
import { Create${capitalize(camelName)}Schema } from '../dto/${camelName}.dto';
import { ${capitalize(camelName)}Service } from '../service/${camelName}.service';
import { AuthRequest } from '../types';
import { ApiResponse, PaginatedResponse } from '@rpa/shared';

export class ${capitalize(camelName)}Controller {
  async list(req: AuthRequest, res: Response) {
    const items = await ${camelName}Service.get${capitalize(camelName)}s({
      userId: req.user!.id,
    });

    const response: ApiResponse = {
      success: true,
      data: items,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async getById(req: AuthRequest, res: Response) {
    const item = await ${camelName}Service.get${capitalize(camelName)}ById(
      { userId: req.user!.id },
      req.params.id,
    );

    const response: ApiResponse = {
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async create(req: AuthRequest, res: Response) {
    const request = Create${capitalize(camelName)}Schema.parse(req.body);
    const item = await ${camelName}Service.create${capitalize(camelName)}(
      { userId: req.user!.id },
      request,
    );

    const response: ApiResponse = {
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json(response);
  }

  async update(req: AuthRequest, res: Response) {
    const request = Create${capitalize(camelName)}Schema.partial().parse(req.body);
    const item = await ${camelName}Service.update${capitalize(camelName)}(
      { userId: req.user!.id },
      req.params.id,
      request,
    );

    const response: ApiResponse = {
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async delete(req: AuthRequest, res: Response) {
    await ${camelName}Service.delete${capitalize(camelName)}(
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

export const ${camelName}Controller = new ${capitalize(camelName)}Controller();
`;

  // Routes
  const routesTemplate = `import { Router } from 'express';
import { ${camelName}Controller } from '../controller/${camelName}.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) =>
  ${camelName}Controller.list(req as any, res).catch(next),
);
router.post('/', (req, res, next) =>
  ${camelName}Controller.create(req as any, res).catch(next),
);
router.get('/:id', (req, res, next) =>
  ${camelName}Controller.getById(req as any, res).catch(next),
);
router.put('/:id', (req, res, next) =>
  ${camelName}Controller.update(req as any, res).catch(next),
);
router.delete('/:id', (req, res, next) =>
  ${camelName}Controller.delete(req as any, res).catch(next),
);

export default router;
`;

  fs.mkdirSync(path.dirname(dtoPath), { recursive: true });
  fs.mkdirSync(path.dirname(repoPath), { recursive: true });
  fs.mkdirSync(path.dirname(servicePath), { recursive: true });
  fs.mkdirSync(path.dirname(controllerPath), { recursive: true });
  fs.mkdirSync(path.dirname(routesPath), { recursive: true });

  fs.writeFileSync(dtoPath, dtoTemplate);
  fs.writeFileSync(repoPath, repoTemplate);
  fs.writeFileSync(servicePath, serviceTemplate);
  fs.writeFileSync(controllerPath, controllerTemplate);
  fs.writeFileSync(routesPath, routesTemplate);

  console.log(`
✅ API 엔드포인트 생성 완료:
  📄 ${dtoPath}
  📄 ${repoPath}
  📄 ${servicePath}
  📄 ${controllerPath}
  📄 ${routesPath}

⚠️  수동으로 설정해야 할 것:
  1. apps/backend/src/index.ts에 라우트 추가:
     app.use('/api/${camelName}', ${camelName}Routes);

  2. Prisma schema 업데이트:
     model ${capitalize(camelName)} {
       id: String @id @default(cuid())
       name: String
       userId: String
       user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
       createdAt: DateTime @default(now())
       updatedAt: DateTime @updatedAt
     }

  3. 마이그레이션 실행:
     pnpm exec prisma migrate dev --name add_${camelName}
  `);
}

main().catch((error) => {
  console.error('❌ 오류:', error);
  process.exit(1);
});
