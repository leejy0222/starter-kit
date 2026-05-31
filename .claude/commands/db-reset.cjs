#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  step: (msg) => console.log(`\n${colors.blue}➜${colors.reset}  ${colors.bright}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset}  ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
};

async function main() {
  console.log(`
${colors.bright}${colors.blue}╭─────────────────────────────────────╮${colors.reset}
${colors.bright}${colors.blue}│   데이터베이스 리셋 + 시딩         │${colors.reset}
${colors.bright}${colors.blue}╰─────────────────────────────────────╯${colors.reset}
  `);

  try {
    const projectRoot = path.join(__dirname, '../..');

    log.step('데이터베이스 삭제 및 마이그레이션 재실행 중...');
    execSync('cd apps/backend && pnpm exec prisma migrate reset --force', {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true
    });
    log.success('데이터베이스 리셋 완료');

    log.step('더미 데이터 생성 중...');
    try {
      execSync(`node .claude/commands/db-seed.cjs`, {
        cwd: projectRoot,
        stdio: 'inherit'
      });
      log.success('더미 데이터 생성 완료');
    } catch (error) {
      log.warning('더미 데이터 생성 스킵');
    }

    console.log(`
${colors.bright}${colors.green}✓ 데이터베이스 리셋 완료!${colors.reset}

생성된 더미 데이터:
  • 테스트 사용자 (test@example.com)
  • 4개의 샘플 워크플로우
  • 다양한 상태의 실행 기록

다시 시작하려면:
  ${colors.bright}pnpm dev${colors.reset}
  `);

  } catch (error) {
    log.warning('데이터베이스 리셋 실패');
    process.exit(1);
  }
}

main();
