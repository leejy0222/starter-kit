# 프로젝트 구조

```
starter-kit/
├── apps/
│   ├── backend/                    # Express.js 백엔드
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts          # 환경 변수
│   │   │   ├── controller/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── workflow.controller.ts
│   │   │   ├── service/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── workflow.service.ts
│   │   │   ├── repository/
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── workflow.repository.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts         # JWT 인증
│   │   │   │   └── errorHandler.ts # 에러 처리
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── workflow.routes.ts
│   │   │   ├── dto/
│   │   │   │   ├── auth.dto.ts
│   │   │   │   └── workflow.dto.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts        # TypeScript 타입
│   │   │   └── index.ts            # 진입점
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # 데이터베이스 스키마
│   │   │   └── migrations/         # 마이그레이션 파일 (자동 생성)
│   │   ├── .env.example            # 환경 변수 예제
│   │   ├── .eslintrc.json          # ESLint 설정
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                   # React 프론트엔드
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── Button.tsx   # 기본 버튼
│       │   │   │   └── Input.tsx    # 기본 입력
│       │   │   └── Layout.tsx       # 레이아웃
│       │   ├── pages/
│       │   │   ├── SignIn.tsx       # 로그인 페이지
│       │   │   ├── SignUp.tsx       # 가입 페이지
│       │   │   └── Home.tsx         # 홈/대시보드
│       │   ├── store/
│       │   │   └── authStore.ts     # Zustand 인증 스토어
│       │   ├── lib/
│       │   │   └── api.ts           # API 클라이언트
│       │   ├── styles/
│       │   │   └── globals.css      # Tailwind CSS
│       │   ├── App.tsx              # 루트 컴포넌트
│       │   └── main.tsx             # 진입점
│       ├── index.html               # HTML 템플릿
│       ├── vite.config.ts           # Vite 설정
│       ├── tailwind.config.ts       # Tailwind 설정
│       ├── postcss.config.js        # PostCSS 설정
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── .eslintrc.json
│       └── package.json
│
├── packages/
│   └── shared/                      # 공용 타입 및 유틸리티
│       ├── src/
│       │   ├── types/
│       │   │   └── api.ts           # API 응답 타입
│       │   └── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── .gitignore
│
├── docker-compose.yml               # PostgreSQL 설정
├── .gitignore
├── tsconfig.json                    # 루트 TypeScript 설정
├── pnpm-workspace.yaml              # pnpm 워크스페이스
├── package.json                     # 루트 패키지
├── README.md                        # 프로젝트 소개
├── QUICK_START.md                   # 빠른 시작 가이드
├── DEVELOPMENT.md                   # 상세 개발 가이드
└── PROJECT_STRUCTURE.md             # 이 파일
```

## 아키텍처 패턴

### 백엔드 레이어드 아키텍처

```
HTTP Request
    ↓
Router
    ↓
Middleware (Auth, Error Handling)
    ↓
Controller (HTTP 처리)
    ↓
Service (비즈니스 로직)
    ↓
Repository (데이터 접근)
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
HTTP Response
```

### 데이터 흐름

```
Request Validation (Zod DTO)
    ↓
Service Context (사용자 정보)
    ↓
비즈니스 로직 실행
    ↓
데이터베이스 작업
    ↓
응답 형식 변환
    ↓
JSON Response
```

## 명명 규칙

### 파일 및 폴더
- **폴더**: snake_case (예: `auth_service/`)
- **파일**: camelCase 또는 PascalCase (예: `UserService.ts`, `auth.dto.ts`)
- **컴포넌트**: PascalCase (예: `UserButton.tsx`)

### 코드
- **변수/함수**: camelCase (예: `getUserById`, `isActive`)
- **클래스**: PascalCase (예: `UserService`, `AuthController`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_RETRIES`, `API_BASE_URL`)
- **인터페이스/타입**: PascalCase (예: `User`, `AuthRequest`)

## 의존성 관계

```
Frontend (React)
    ↓ axios/API calls
    ↓ @rpa/shared (타입)
Backend (Express)
    ↓ uses
PostgreSQL Database
```

## 모듈 경로

### 백엔드 임포트
```typescript
// 같은 앱 내 import
import { userRepository } from '../repository/user.repository';
import { AppError } from '../middleware/errorHandler';

// 공용 패키지 import
import { ApiResponse } from '@rpa/shared';
```

### 프론트엔드 임포트
```typescript
// 같은 앱 내 import
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

// 공용 패키지 import
import { ApiResponse } from '@rpa/shared';
```

## 데이터베이스 테이블

### User (사용자)
- id: 기본키
- email: 고유, 이메일
- password: 해시된 비밀번호
- name: 사용자명
- role: 역할 (ADMIN, USER, VIEWER)
- isActive: 활성 여부
- createdAt, updatedAt: 타임스탬프

### Workflow (워크플로우)
- id: 기본키
- name: 이름
- description: 설명
- userId: 소유자 (외래키)
- definition: JSON 정의
- status: DRAFT, PUBLISHED, ARCHIVED
- isActive: 활성 여부
- createdAt, updatedAt: 타임스탬프

### Execution (실행 기록)
- id: 기본키
- workflowId: 워크플로우 (외래키)
- userId: 실행자 (외래키)
- status: PENDING, RUNNING, SUCCESS, FAILED, CANCELLED
- result: JSON 결과
- error: 에러 메시지
- startedAt: 시작 시간
- completedAt: 완료 시간
- duration: 실행 시간 (ms)
- createdAt, updatedAt: 타임스탬프

## 환경 변수

### 백엔드 (.env)
```
DATABASE_URL=postgresql://...
PORT=3000
JWT_SECRET=...
JWT_EXPIRATION=24h
NODE_ENV=development
```

### 프론트엔드 (.env, 필요시)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 개발 팀을 위한 팁

1. **TypeScript 활용**: any 타입 금지, 완전한 타입 정의
2. **에러 처리**: AppError로 일관된 에러 처리
3. **DTO 검증**: Zod로 모든 입력 데이터 검증
4. **코드 리뷰**: 레이어드 아키텍처 준수 확인
5. **테스트**: 각 레이어별 단위 테스트 작성

## 확장 계획

- [ ] 워크플로우 실행 엔진
- [ ] WebSocket 실시간 모니터링
- [ ] 자동화 도구 통합 (UiPath, Blue Prism)
- [ ] 스케줄링 (BullMQ)
- [ ] 로깅/감사 (ELK Stack)
- [ ] 권한 관리 (RBAC)
- [ ] 테스트 자동화
- [ ] CI/CD 파이프라인
