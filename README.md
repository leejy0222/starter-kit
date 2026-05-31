# 🚀 웹 애플리케이션 스타터 킷

**최대한 빠르게 웹 애플리케이션을 프로토타입**할 수 있는 현대적인 스타터 킷입니다.

> 5분 안에 실행, 몇 시간 안에 프로토타입 완성

---

## 📦 Starter Kit 설명

**빠른 웹 애플리케이션 프로토타입 개발을 위한 모던 스타터 킷**

### ✨ 주요 기능

**자동화된 개발 도구:**
- `useApi` 훅 - API 로딩/에러 자동 관리
- `useApiQuery` 훅 - 데이터 페칭 자동화
- 전역 토스트 시스템 - 사용자 피드백 자동 처리

**재사용 가능한 UI 컴포넌트:**
- Card, Button, Input, Dialog, Table, Badge
- FormField - 폼 필드 자동화
- Layout - 네비게이션 포함 레이아웃

**완성된 기본 기능:**
- 회원가입/로그인 (JWT 기반)
- 워크플로우 CRUD (Create, Read, Update, Delete)
- 반응형 디자인
- 에러 처리 및 검증

**아키텍처:**
- 레이어드 아키텍처 (Controller → Service → Repository)
- DTO 패턴으로 데이터 검증
- 의존성 주입
- 타입 안전성 (TypeScript + Zod)

### 🎯 용도

다음과 같은 상황에서 빠르게 시작하세요:

✅ **신규 웹 애플리케이션 프로토타입** - 기본 구조와 코드 패턴이 완성되어 있음  
✅ **포트폴리오 프로젝트** - 모던한 기술스택과 프로페셔널 UI로 인상적인 결과물  
✅ **SaaS 플랫폼의 기초** - 확장 가능한 아키텍처로 대규모 프로젝트로 성장 가능  
✅ **팀 프로젝트의 기준점** - 일관된 코딩 스타일과 표준화된 패턴  
✅ **자동화 도구 통합** - RPA, 워크플로우 엔진 등 확장을 위한 견고한 기초

### 📊 개발 속도

| 항목 | 효과 |
|------|------|
| **보일러플레이트 코드** | 40% 감소 |
| **개발 시간** | 2-3배 단축 |
| **기능 구현** | 사흘이 아닌 몇 시간 |
| **코드 재사용성** | 매우 높음 |

---

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

## 🔮 확장 가능성

이 스타터킷 위에 다음을 쉽게 추가할 수 있습니다:

- 실시간 기능 (WebSocket)
- 고급 권한 관리 (RBAC)
- 데이터 대시보드 (차트, 그래프)
- 파일 업로드
- 결제 시스템
- 알림 시스템
- 워크플로우 실행 엔진
- 자동화 도구 연동 (UiPath, Blue Prism 등)

## 🎓 학습 가치

이 프로젝트를 통해 배울 수 있는 것:

- 모던 웹 개발 패턴
- TypeScript의 실전 활용
- 레이어드 아키텍처 설계
- API 설계 및 구현
- React 상태 관리
- 데이터베이스 설계
- 프로덕션급 코드 작성

## 📚 문서

- 📖 **QUICK_START.md** - 5분 안에 시작
- 📖 **RAPID_DEVELOPMENT.md** - 빠른 개발 패턴
- 📖 **DEVELOPMENT.md** - 상세 개발 가이드
- 📖 **PROJECT_STRUCTURE.md** - 프로젝트 구조
- 📖 **IMPROVEMENTS.md** - 개선 사항 상세 설명

## 라이선스

MIT
