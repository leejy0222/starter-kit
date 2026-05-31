# 빠른 웹 애플리케이션 개발 가이드 🚀

이 스타터킷은 **최대한 빠르게 웹 애플리케이션을 프로토타입**할 수 있도록 설계되었습니다.

## 핵심 도구들

### 1. 자동 에러/로딩 처리 (`useApi` 훅)

```typescript
// 예전 방식 (번거로움)
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
try {
  setIsLoading(true);
  const res = await api.call();
  // ...
} catch (err) {
  console.error(err);
}

// 새로운 방식 (자동화됨)
const { mutate, isLoading } = useApi(api.call, {
  onSuccess: (data) => { /* 성공 처리 */ },
  successMessage: '완료되었습니다',
});

<Button onClick={() => mutate(data)} disabled={isLoading}>
  {isLoading ? '처리 중...' : '완료'}
</Button>
```

### 2. 전역 토스트 시스템

```typescript
import { toast } from '@/store/toastStore';

// 자동 에러 표시 (useApi에서 처리됨)
// 또는 수동으로
toast.success('저장되었습니다');
toast.error('오류가 발생했습니다');
toast.info('정보입니다');
toast.warning('주의하세요');
```

### 3. 폼 필드 자동화

```typescript
// Before
<div>
  <label>이름</label>
  <input {...register('name')} />
  {errors.name && <p>{errors.name.message}</p>}
</div>

// After
<FormField
  label="이름"
  name="name"
  register={register('name')}
  error={errors.name?.message}
/>
```

### 4. UI 컴포넌트 라이브러리

모든 필요한 컴포넌트가 준비되어 있습니다:

```typescript
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
  Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Button, Input, Badge,
} from '@/components/ui';
```

## 실전 예제: CRUD 페이지 만들기

### 1단계: API 클라이언트 추가

```typescript
// lib/api.ts에 추가
export const api = {
  users: {
    list: () => apiClient.get('/users'),
    create: (data: any) => apiClient.post('/users', data),
    update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
    delete: (id: string) => apiClient.delete(`/users/${id}`),
  },
};
```

### 2단계: 목록 페이지

```typescript
import { useApiQuery } from '@/lib/useApi';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { api } from '@/lib/api';

export const UsersList = () => {
  const { data: users = [], isLoading } = useApiQuery(() =>
    api.users.list(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
```

### 3단계: 생성/수정 폼

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApi } from '@/lib/useApi';
import { FormField, Form } from '@/components/FormField';
import { Button } from '@/components/ui';
import { api } from '@/lib/api';

const UserSchema = z.object({
  name: z.string().min(1, '이름 입력'),
  email: z.string().email('유효한 이메일'),
});

export const CreateUserModal = ({ onClose }: { onClose: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UserSchema),
  });

  const { mutate: createUser, isLoading } = useApi(api.users.create, {
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <Form onSubmit={handleSubmit((data) => createUser(data))}>
      <FormField
        label="이름"
        name="name"
        register={register('name')}
        error={errors.name?.message}
      />
      <FormField
        label="이메일"
        name="email"
        register={register('email')}
        error={errors.email?.message}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </Form>
  );
};
```

## 개발 흐름

```
1. API 엔드포인트 정의 (백엔드)
   ↓
2. API 클라이언트 추가 (lib/api.ts)
   ↓
3. DTO/Zod 스키마 작성
   ↓
4. 페이지/컴포넌트 작성
   - useApi/useApiQuery로 데이터 처리
   - FormField/Card 컴포넌트로 UI 구성
   - 토스트로 피드백 표시
```

## 생산성 팁

### 팁 1: 복사-붙여넣기 패턴

자주 사용되는 패턴을 복사해서 빠르게 적응시키세요:

```typescript
// 리스트 페이지 템플릿
const { data: items = [], isLoading } = useApiQuery(() => api.items.list());

// 생성 폼 템플릿
const { mutate, isLoading } = useApi(api.items.create, {
  onSuccess: () => refetch(),
  successMessage: '추가되었습니다',
});
```

### 팁 2: 컴포넌트 조합

```typescript
// 헤더 + 테이블 + 페이지네이션 = 완성된 목록 페이지
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h1>목록</h1>
    <Button onClick={() => setCreateOpen(true)}>추가</Button>
  </div>
  <Table data={items} />
</div>
```

### 팁 3: 백엔드 빠르게 만들기

```typescript
// 1. Repository 메서드
async findAll() {
  return prisma.user.findMany();
}

// 2. Service 메서드
async getAll(context: ServiceContext) {
  return userRepository.findAll();
}

// 3. Controller 메서드
async list(req: Request, res: Response) {
  const result = await userService.getAll({ userId: req.user!.id });
  res.json({ success: true, data: result });
}

// 4. 라우트
router.get('/', (req, res, next) =>
  userController.list(req as any, res).catch(next),
);
```

## 공통 작업들

### 데이터 검증

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
});

// 백엔드
const data = CreateUserSchema.parse(req.body);

// 프론트엔드
const { register } = useForm({
  resolver: zodResolver(CreateUserSchema),
});
```

### 에러 처리

```typescript
// 자동 (useApi가 처리)
const { mutate } = useApi(api.call, {
  showToast: true, // 자동 에러 토스트
});

// 수동
const { mutate } = useApi(api.call, {
  onError: (error) => {
    console.error('Custom error:', error);
  },
});
```

### 페이지네이션

```typescript
const [page, setPage] = useState(1);
const { data } = useApiQuery(() =>
  api.items.list(page).then(res => ({
    data: { success: true, data: res.data.data.items },
  })),
);
```

## 성능 최적화

### 1. 요청 최소화
```typescript
// Bad: 매번 요청
useEffect(() => {
  api.getUser(id).then(...);
}, []);

// Good: 한 번만 요청
const { data } = useApiQuery(() => api.getUser(id));
```

### 2. 상태 최소화
```typescript
// Bad: 많은 useState
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState('');

// Good: 폼 라이브러리 사용
const { register } = useForm();
```

### 3. 렌더링 최적화
```typescript
// Zustand는 필요한 부분만 렌더링
const user = useAuthStore(state => state.user);
```

## 확장하기

1. **새 페이지 추가**
   - `src/pages/NewPage.tsx` 생성
   - `App.tsx`에 라우트 추가
   - API 호출 구현

2. **새 API 엔드포인트**
   - 백엔드: Repository → Service → Controller → Router
   - 프론트엔드: `lib/api.ts` 추가

3. **새 컴포넌트**
   - `src/components/NewComponent.tsx` 생성
   - 필요한 props 정의
   - 재사용 가능하게 작성

## 디버깅

```typescript
// 네트워크 로그
// Browser DevTools → Network 탭

// API 응답 확인
console.log(response.data);

// 상태 확인 (Zustand)
console.log(useAuthStore.getState());

// 타입 에러 확인
pnpm type-check
```

## 다음 단계

1. 워크플로우 빌더 UI 추가
2. 실시간 모니터링 (WebSocket)
3. 고급 필터링/검색
4. 대시보드 차트
5. 권한 관리

---

**핵심: 작은 것부터 시작하고, 패턴을 반복하고, 필요할 때 확장하세요!**
