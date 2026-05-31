# 빠른 시작 가이드 ⚡

RPA 웹 애플리케이션을 **5분 안에** 실행하세요.

## 1단계: 환경 설정

```bash
# 저장소에서 시작 (이미 있다고 가정)
cd starter-kit

# 환경 파일 설정
cp apps/backend/.env.example apps/backend/.env
```

`.env` 파일 확인:
```
DATABASE_URL="postgresql://rpa_user:rpa_password@localhost:5432/rpa_db"
PORT=3000
JWT_SECRET=dev-secret-key
NODE_ENV=development
```

## 2단계: 데이터베이스 시작

```bash
# Docker 컨테이너 실행
docker-compose up -d

# 컨테이너 상태 확인
docker-compose ps
```

## 3단계: 의존성 설치 및 마이그레이션

```bash
# 모든 의존성 설치
pnpm install

# 데이터베이스 마이그레이션
cd apps/backend
pnpm exec prisma migrate dev

# 프론트엔드로 돌아오기
cd ../..
```

## 4단계: 개발 서버 시작

루트 디렉토리에서:

```bash
pnpm dev
```

출력:
```
backend: Server running on port 3000
frontend: VITE v5.1.0  ready in 123 ms
```

## 접속

- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:3000/api
- **헬스 체크**: http://localhost:3000/health

## 테스트하기

### 1. 회원가입
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

응답:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "token": "eyJhbGc..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 워크플로우 생성
토큰을 받은 후:

```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My First Workflow",
    "description": "Test workflow",
    "definition": {
      "version": "1.0",
      "steps": []
    }
  }'
```

### 3. 웹 인터페이스 사용
1. http://localhost:5173 접속
2. "가입하기" 클릭
3. 계정 생성
4. 자동으로 로그인됨
5. "새 워크플로우 생성" 클릭

## 데이터베이스 관리

### Prisma Studio 실행 (GUI)
```bash
cd apps/backend
pnpm exec prisma studio
```

http://localhost:5555에서 데이터 확인 및 수정

### PostgreSQL 직접 접속
```bash
# Docker 내 PostgreSQL 접속
docker-compose exec postgres psql -U rpa_user -d rpa_db

# 테이블 목록
\dt

# 사용자 조회
SELECT * FROM "User";

# 종료
\q
```

## 개발 중 유용한 명령어

```bash
# 타입 체크
pnpm type-check

# 린트
pnpm lint

# 빌드
pnpm build

# 마이그레이션 리셋 (⚠️ 데이터 삭제)
cd apps/backend && pnpm exec prisma migrate reset
```

## 문제 해결

### "Cannot find module '@rpa/shared'"
```bash
# 의존성 재설치
pnpm install --force

# 캐시 초기화
pnpm store prune
```

### 데이터베이스 연결 실패
```bash
# Docker 상태 확인
docker-compose logs postgres

# 포트 확인
docker-compose ps

# 재시작
docker-compose restart postgres
```

### 마이그레이션 에러
```bash
# 상태 확인
cd apps/backend
pnpm exec prisma migrate status

# 리셋 (모든 데이터 삭제됨!)
pnpm exec prisma migrate reset
```

## 다음 단계

- 🔍 `DEVELOPMENT.md` - 상세 개발 가이드
- 📚 `README.md` - 전체 프로젝트 정보
- 🛠️ 자신의 요구사항에 맞게 커스터마이징
- 🚀 자동화 도구 연동 구현

## 지원되는 포트

| 서비스 | 포트 | URL |
|--------|------|-----|
| 프론트엔드 | 5173 | http://localhost:5173 |
| 백엔드 | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Prisma Studio | 5555 | http://localhost:5555 |

즐거운 개발 되세요! 🎉
