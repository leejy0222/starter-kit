# 개발 가이드

## 폴더 구조

### Backend (`apps/backend`)
```
src/
├── config/          # 환경 설정
├── controller/      # HTTP 요청 처리
├── service/         # 비즈니스 로직
├── repository/      # 데이터 접근
├── middleware/      # Express 미들웨어
├── routes/          # API 라우트
├── dto/             # 데이터 전송 객체
├── types/           # TypeScript 타입
└── index.ts         # 진입점

prisma/
├── schema.prisma    # 데이터베이스 스키마
└── migrations/      # 마이그레이션 파일
```

### Frontend (`apps/frontend`)
```
src/
├── components/      # React 컴포넌트
│   ├── ui/         # 기본 UI 컴포넌트
│   └── Layout.tsx  # 레이아웃
├── pages/          # 페이지 컴포넌트
├── store/          # Zustand 상태 관리
├── lib/            # 유틸리티 함수
├── styles/         # 전역 스타일
├── App.tsx         # 루트 컴포넌트
└── main.tsx        # 진입점

index.html          # HTML 템플릿
```

## 개발 명령어

### 프로젝트 전체
```bash
# 개발 서버 시작
pnpm dev

# 빌드
pnpm build

# 타입 체크
pnpm type-check

# 린트
pnpm lint
```

### 백엔드 전용
```bash
cd apps/backend

# 개발 서버
pnpm dev

# Prisma 마이그레이션
pnpm exec prisma migrate dev
pnpm exec prisma migrate reset

# Prisma Studio (DB GUI)
pnpm exec prisma studio
```

### 프론트엔드 전용
```bash
cd apps/frontend

# 개발 서버
pnpm dev

# 빌드
pnpm build

# 미리보기
pnpm preview
```

## 데이터베이스 마이그레이션

### 첫 번째 마이그레이션
```bash
cd apps/backend
pnpm exec prisma migrate dev --name init
```

### 스키마 변경 후
```bash
# 마이그레이션 생성 및 적용
pnpm exec prisma migrate dev --name <마이그레이션-이름>

# 예: pnpm exec prisma migrate dev --name add_execution_logs
```

### 마이그레이션 리셋 (주의!)
```bash
# 데이터베이스 초기화 및 마이그레이션 다시 실행
pnpm exec prisma migrate reset
```

## API 개발 패턴

### 새로운 엔드포인트 추가 순서

1. **DTO 정의** (`src/dto/`)
```typescript
export const CreateItemSchema = z.object({
  name: z.string(),
});

export type CreateItemRequest = z.infer<typeof CreateItemSchema>;
```

2. **Repository 추가** (`src/repository/`)
```typescript
export class ItemRepository {
  async create(data: CreateItemData) {
    return prisma.item.create({ data });
  }
}
```

3. **Service 추가** (`src/service/`)
```typescript
export class ItemService {
  async createItem(context: ServiceContext, request: CreateItemRequest) {
    return itemRepository.create({
      ...request,
      userId: context.userId,
    });
  }
}
```

4. **Controller 추가** (`src/controller/`)
```typescript
export class ItemController {
  async create(req: AuthRequest, res: Response) {
    const request = CreateItemSchema.parse(req.body);
    const item = await itemService.createItem(
      { userId: req.user!.id },
      request,
    );
    res.status(201).json({ success: true, data: item });
  }
}
```

5. **라우트 추가** (`src/routes/`)
```typescript
router.post('/', (req, res, next) =>
  itemController.create(req as any, res).catch(next),
);
```

## 프론트엔드 개발 패턴

### 새로운 페이지/컴포넌트 추가

1. **페이지 생성** (`src/pages/`)
```typescript
export const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.items.list().then(res => setItems(res.data.data.items));
  }, []);

  return <div>{/* JSX */}</div>;
};
```

2. **라우트에 추가** (`src/App.tsx`)
```typescript
<Route path="/items" element={<ItemList />} />
```

3. **네비게이션에 추가** (필요시 `src/components/Layout.tsx`)

## 타입 안전성

### any 타입 금지
```typescript
// ❌ 금지
const result: any = fetchData();

// ✅ 허용
interface Data {
  id: string;
  name: string;
}
const result: Data = fetchData();
```

### Zod로 런타임 검증
```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0),
});

const data = schema.parse(request.body);
```

## 에러 처리

### 백엔드
```typescript
if (condition) {
  throw new AppError('ERROR_CODE', 'Error message', 400);
}
```

### 프론트엔드
```typescript
try {
  await api.items.create(data);
} catch (error) {
  console.error('Failed:', error);
  // UI에서 에러 표시
}
```

## 환경 변수

### 백엔드 (`.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/rpa_db
PORT=3000
JWT_SECRET=your-secret
JWT_EXPIRATION=24h
NODE_ENV=development
```

## 문제 해결

### 마이그레이션 에러
```bash
# 마이그레이션 상태 확인
pnpm exec prisma migrate status

# 마이그레이션 실패 시 리셋 (개발 환경만)
pnpm exec prisma migrate reset
```

### 타입 에러
```bash
# 전체 타입 체크
pnpm type-check

# TypeScript 캐시 초기화
rm -rf dist/
pnpm build
```

### 모듈 찾기 안 함
```bash
# 의존성 재설치
pnpm install

# 심링크 재생성 (monorepo)
pnpm install --force
```
