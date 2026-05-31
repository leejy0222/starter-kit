# 🚀 웹 애플리케이션 스타터 킷

**최대한 빠르게 웹 애플리케이션을 프로토타입**할 수 있는 현대적인 스타터 킷입니다.

> 5분 안에 실행, 몇 시간 안에 프로토타입 완성

## 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **React Hook Form + Zod** - 폼 관리 및 검증
- **Zustand** - 상태 관리
- **Tailwind CSS** - 스타일링

### 백엔드
- **Node.js + Express** - API 서버
- **TypeScript** - 타입 안전성
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스
- **JWT** - 인증

### 인프라
- **Docker Compose** - 로컬 개발 환경

## 프로젝트 구조

```
.
├── apps/
│   ├── frontend/          # React 프론트엔드
│   └── backend/           # Express 백엔드
├── packages/
│   └── shared/            # 공용 타입 및 유틸리티
├── docker-compose.yml     # 로컬 개발 환경
└── package.json           # 루트 패키지
```

## 시작하기

### 사전 요구사항
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd starter-kit
```

2. 의존성 설치
```bash
pnpm install
```

3. 환경 변수 설정
```bash
cp apps/backend/.env.example apps/backend/.env
```

4. 데이터베이스 시작
```bash
docker-compose up -d
```

5. Prisma 마이그레이션
```bash
cd apps/backend
pnpm exec prisma migrate dev
```

### 개발 시작

루트 디렉토리에서:

```bash
pnpm dev
```

- 프론트엔드: http://localhost:5173
- 백엔드: http://localhost:3000
- 데이터베이스: localhost:5432

## API 엔드포인트

### 인증
- `POST /api/auth/sign-up` - 회원가입
- `POST /api/auth/sign-in` - 로그인

### 워크플로우
- `GET /api/workflows` - 워크플로우 목록
- `POST /api/workflows` - 워크플로우 생성
- `GET /api/workflows/:id` - 워크플로우 상세
- `PUT /api/workflows/:id` - 워크플로우 수정
- `DELETE /api/workflows/:id` - 워크플로우 삭제

## 아키텍처

### 백엔드 레이어드 아키텍처
```
Controller → Service → Repository → Database
```

- **Controller**: HTTP 요청/응답 처리
- **Service**: 비즈니스 로직
- **Repository**: 데이터 접근 계층
- **DTO**: 데이터 전송 객체 (Zod로 검증)

### 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **localStorage**: 영속성

## 개발 가이드

### 코딩 스타일
- 들여쓰기: 2칸
- 네이밍: camelCase
- 타입: any 금지

### 에러 처리
- 백엔드: AppError 클래스 사용
- 프론트엔드: API 인터셉터로 401 처리

### 데이터 검증
- Zod 스키마로 입력 데이터 검증
- 타입 안전성 보장

## 다음 단계

### 구현 예정
1. 워크플로우 실행 엔진
2. 실시간 모니터링 (WebSocket)
3. 자동화 도구 연동 (UiPath, Blue Prism 등)
4. 스케줄링 (BullMQ)
5. 로깅 및 감사 (ELK Stack)
6. 권한 관리 (RBAC)

## 라이선스

MIT
