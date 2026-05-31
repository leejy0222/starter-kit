#!/usr/bin/env node

const path = require('path');
process.chdir(path.join(__dirname, '../../apps/backend'));

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

async function main() {
  console.log(`${colors.yellow}🌱 더미 데이터 생성 중...${colors.reset}\n`);

  try {
    // 테스트 사용자 생성
    const password = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: password,
        name: 'Test User',
        role: 'USER',
      },
    });
    console.log(`${colors.green}✓${colors.reset} 사용자 생성: ${user.email}`);

    // 샘플 워크플로우 생성
    const workflows = await Promise.all([
      prisma.workflow.create({
        data: {
          name: '일일 보고서 생성',
          description: '매일 9시에 보고서 자동 생성',
          status: 'PUBLISHED',
          isActive: true,
          userId: user.id,
          definition: {
            version: '1.0',
            steps: [
              { name: 'data-collection', type: 'fetch' },
              { name: 'report-generation', type: 'transform' },
              { name: 'email-send', type: 'action' }
            ]
          },
        },
      }),
      prisma.workflow.create({
        data: {
          name: '고객 데이터 동기화',
          description: 'CRM과 ERP 시스템 데이터 동기화',
          status: 'PUBLISHED',
          isActive: true,
          userId: user.id,
          definition: {
            version: '1.0',
            steps: [
              { name: 'fetch-crm', type: 'fetch' },
              { name: 'sync-erp', type: 'action' }
            ]
          },
        },
      }),
      prisma.workflow.create({
        data: {
          name: '월간 결산 자동화',
          description: '월말에 재무 데이터 자동 정리',
          status: 'DRAFT',
          isActive: false,
          userId: user.id,
          definition: {
            version: '1.0',
            steps: []
          },
        },
      }),
      prisma.workflow.create({
        data: {
          name: '이메일 캠페인 발송',
          description: '마케팅 캠페인 자동 이메일 발송',
          status: 'PUBLISHED',
          isActive: true,
          userId: user.id,
          definition: {
            version: '1.0',
            steps: [
              { name: 'query-customers', type: 'fetch' },
              { name: 'send-email', type: 'action' }
            ]
          },
        },
      }),
    ]);

    console.log(`${colors.green}✓${colors.reset} 워크플로우 생성: ${workflows.length}개`);

    // 실행 기록 생성
    const now = new Date();
    const executions = await Promise.all([
      // 성공한 실행들
      ...workflows.slice(0, 2).map((workflow, index) =>
        prisma.execution.create({
          data: {
            workflowId: workflow.id,
            userId: user.id,
            status: 'SUCCESS',
            result: { message: '실행 완료', itemCount: Math.floor(Math.random() * 100) + 10 },
            startedAt: new Date(now.getTime() - index * 60 * 60 * 1000),
            completedAt: new Date(now.getTime() - index * 60 * 60 * 1000 + 5 * 60 * 1000),
            duration: 5 * 60 * 1000,
          },
        })
      ),
      // 실패한 실행
      prisma.execution.create({
        data: {
          workflowId: workflows[1].id,
          userId: user.id,
          status: 'FAILED',
          error: 'API 연결 실패',
          startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 1 * 60 * 1000),
          duration: 1 * 60 * 1000,
        },
      }),
      // 진행 중인 실행
      prisma.execution.create({
        data: {
          workflowId: workflows[0].id,
          userId: user.id,
          status: 'RUNNING',
          startedAt: new Date(now.getTime() - 10 * 60 * 1000),
        },
      }),
    ]);

    console.log(`${colors.green}✓${colors.reset} 실행 기록 생성: ${executions.length}개`);

    console.log(`
${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.green}✓ 더미 데이터 생성 완료!${colors.reset}
${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

테스트 계정:
  ${colors.yellow}이메일:${colors.reset} test@example.com
  ${colors.yellow}비밀번호:${colors.reset} password123

생성된 데이터:
  ${colors.yellow}사용자:${colors.reset} 1개
  ${colors.yellow}워크플로우:${colors.reset} ${workflows.length}개
  ${colors.yellow}실행 기록:${colors.reset} ${executions.length}개
    `);

  } catch (error) {
    console.error(`${colors.red}✗ 오류 발생:${colors.reset}`, error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
