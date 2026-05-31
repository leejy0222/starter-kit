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
  cyan: '\x1b[36m',
};

const log = {
  step: (msg) =>
    console.log(`\n${colors.blue}➜${colors.reset}  ${colors.bright}${msg}${colors.reset}`),
  success: (msg) =>
    console.log(`${colors.green}✓${colors.reset}  ${msg}`),
  failure: (msg) =>
    console.log(`${colors.red}✗${colors.reset}  ${colors.bright}${msg}${colors.reset}`),
  warning: (msg) =>
    console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
  info: (msg) =>
    console.log(`${colors.cyan}ℹ${colors.reset}  ${msg}`),
};

const results = [];

function runStep(label, command, cwd) {
  log.step(label);
  const startTime = Date.now();
  try {
    execSync(command, {
      stdio: 'inherit',
      shell: true,
      cwd: cwd || path.join(__dirname, '../../..'),
    });
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    log.success(`${label} (${elapsed}s)`);
    results.push({ label, passed: true, elapsed });
    return true;
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    log.failure(`${label} 실패 (${elapsed}s)`);
    results.push({ label, passed: false, elapsed });
    return false;
  }
}

async function main() {
  const projectRoot = path.join(__dirname, '../../..');

  console.log(`
${colors.bright}${colors.blue}╭──────────────────────────────────────────╮${colors.reset}
${colors.bright}${colors.blue}│   RPA Platform 배포 전 테스트 파이프라인  │${colors.reset}
${colors.bright}${colors.blue}╰──────────────────────────────────────────╯${colors.reset}
  `);

  log.info(`프로젝트 루트: ${projectRoot}`);

  const steps = [
    { label: '[1/5] 프론트엔드 Lint', command: 'pnpm --filter @rpa/frontend run lint' },
    { label: '[2/5] 백엔드 Lint', command: 'pnpm --filter @rpa/backend run lint' },
    { label: '[3/5] 프론트엔드 타입 체크', command: 'pnpm --filter @rpa/frontend run type-check' },
    { label: '[4/5] 백엔드 타입 체크', command: 'pnpm --filter @rpa/backend run type-check' },
    { label: '[5/5] 전체 단위 테스트', command: 'pnpm run test:unit' },
  ];

  let hasFailure = false;
  for (const step of steps) {
    const passed = runStep(step.label, step.command, projectRoot);
    if (!passed) {
      hasFailure = true;
      log.warning('계속 실행 중 (모든 문제를 파악하기 위해)...');
    }
  }

  console.log(`
${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.bright}  배포 전 테스트 결과 리포트${colors.reset}
${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
  `);

  results.forEach(({ label, passed, elapsed }) => {
    const icon = passed
      ? `${colors.green}✓${colors.reset}`
      : `${colors.red}✗${colors.reset}`;
    const labelColor = passed ? colors.reset : colors.red;
    console.log(`  ${icon}  ${labelColor}${label}${colors.reset}  ${colors.yellow}(${elapsed}s)${colors.reset}`);
  });

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  console.log('');

  if (hasFailure) {
    console.log(`${colors.bright}${colors.red}╭──────────────────────────────────────────╮${colors.reset}`);
    console.log(`${colors.bright}${colors.red}│  ✗ 배포 차단: ${passedCount}/${totalCount} 단계 통과            │${colors.reset}`);
    console.log(`${colors.bright}${colors.red}│  위 실패 항목을 수정 후 다시 실행하세요  │${colors.reset}`);
    console.log(`${colors.bright}${colors.red}╰──────────────────────────────────────────╯${colors.reset}`);
    console.log('');
    process.exit(1);
  } else {
    console.log(`${colors.bright}${colors.green}╭──────────────────────────────────────────╮${colors.reset}`);
    console.log(`${colors.bright}${colors.green}│  ✓ 배포 승인: ${passedCount}/${totalCount} 단계 모두 통과!     │${colors.reset}`);
    console.log(`${colors.bright}${colors.green}│  이 코드는 배포할 준비가 되었습니다.    │${colors.reset}`);
    console.log(`${colors.bright}${colors.green}╰──────────────────────────────────────────╯${colors.reset}`);
    console.log('');
  }
}

main().catch((error) => {
  log.failure(`예상치 못한 오류: ${error.message}`);
  process.exit(1);
});
