# pre-deploy 에이전트

배포 전 자동 검증 파이프라인을 실행하는 에이전트입니다.

## 개요

코드를 배포하기 전에 다음 5단계를 자동으로 검증합니다:

1. **프론트엔드 Lint** - 코드 스타일 검사
2. **백엔드 Lint** - 코드 스타일 검사  
3. **프론트엔드 타입 체크** - TypeScript 타입 안정성 확인
4. **백엔드 타입 체크** - TypeScript 타입 안정성 확인
5. **전체 단위 테스트** - 모든 단위 테스트 실행

## 사용법

```bash
pnpm test:pre-deploy
```

## 실행 스크립트

- **위치**: `.claude/commands/agents/pre-deploy.cjs`
- **런타임**: Node.js (CommonJS)
- **의존성**: pnpm, vitest, eslint

## 출력

- 각 단계별 성공/실패 결과
- 소요 시간
- 최종 배포 승인/차단 결과

## 특징

✅ **자동 검증**: Git 훅으로 자동 실행 가능
✅ **병렬 실행**: 프론트엔드/백엔드 동시 검사
✅ **컬러 출력**: 읽기 쉬운 결과 표시
✅ **상세 리포트**: 모든 오류 정보 제공

## 관련 명령어

```bash
# 단위 테스트만 실행
pnpm test:unit

# Watch 모드 (개발 중)
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage
```

## Git 훅 연동

- **pre-push 훅**: 푸시 전 자동 실행
- **구성**: `.husky/pre-push`
