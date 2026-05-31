#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
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

async function exec(command, description) {
  try {
    log.step(description);
    execSync(command, { stdio: 'inherit', shell: true });
    log.success(description);
    return true;
  } catch (error) {
    log.warning(`${description} 실패`);
    return false;
  }
}

async function main() {
  console.log(`
${colors.bright}${colors.blue}╭─────────────────────────────────────╮${colors.reset}
${colors.bright}${colors.blue}│   RPA Platform 개발 환경 초기화     │${colors.reset}
${colors.bright}${colors.blue}╰─────────────────────────────────────╯${colors.reset}
  `);

  try {
    // 1. .env 파일 생성
    const projectRoot = path.join(__dirname, '../..');
    const envPath = path.join(projectRoot, 'apps/backend/.env');
    const envExamplePath = path.join(projectRoot, 'apps/backend/.env.example');

    log.step('환경 변수 설정');
    if (!fs.existsSync(envPath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log.success('환경 변수 설정');
    } else {
      log.warning('.env 파일이 이미 존재합니다. 스킵');
    }

    // 2. 의존성 설치
    await exec('pnpm install', '의존성 설치 중...');

    // 3. Docker PostgreSQL 시작
    log.step('PostgreSQL 데이터베이스 시작');
    try {
      execSync('docker-compose up -d', { cwd: projectRoot, stdio: 'pipe' });
      log.success('PostgreSQL 데이터베이스 시작');

      // DB 준비 대기
      log.step('데이터베이스 준비 중... (5초 대기)');
      for (let i = 5; i > 0; i--) {
        process.stdout.write(`\r${colors.yellow}${i}초 대기 중...${colors.reset}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      console.log('');
      log.success('데이터베이스 준비 완료');
    } catch (error) {
      log.warning('Docker가 설치되지 않았습니다. 나머지 단계를 계속합니다.');
    }

    // 4. Prisma 마이그레이션
    log.step('데이터베이스 마이그레이션 실행');
    try {
      execSync('cd apps/backend && pnpm exec prisma migrate deploy', {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true
      });
      log.success('데이터베이스 마이그레이션 완료');
    } catch (error) {
      log.warning('마이그레이션 실패. 나머지 단계를 계속합니다.');
    }

    // 5. 더미 데이터 생성
    log.step('더미 데이터 생성');
    try {
      execSync('node .claude/commands/db-seed', {
        cwd: projectRoot,
        stdio: 'inherit'
      });
      log.success('더미 데이터 생성 완료');
    } catch (error) {
      log.warning('더미 데이터 생성 실패. 계속 진행합니다.');
    }

    console.log(`
${colors.bright}${colors.green}╭─────────────────────────────────────╮${colors.reset}
${colors.bright}${colors.green}│   초기화 완료! 🎉                  │${colors.reset}
${colors.bright}${colors.green}╰─────────────────────────────────────╯${colors.reset}

${colors.bright}다음 단계:${colors.reset}

1. 개발 서버 시작:
   ${colors.bright}pnpm dev${colors.reset}

2. 브라우저 열기:
   ${colors.blue}http://localhost:5173${colors.reset}

3. 백엔드 API:
   ${colors.blue}http://localhost:3000${colors.reset}
  `);

  } catch (error) {
    console.error('❌ 초기화 중 오류 발생');
    process.exit(1);
  }
}

main();
