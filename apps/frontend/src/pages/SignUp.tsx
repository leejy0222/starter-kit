import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { FormField, Form } from '../components/FormField';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useApi } from '../lib/useApi';
import { api } from '../lib/api';

const SignUpSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type SignUpForm = z.infer<typeof SignUpSchema>;

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
  });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { mutate: signUp, isLoading } = useApi(api.signUp, {
    onSuccess: (data: any) => {
      setAuth(data, data.token);
      navigate('/');
    },
    successMessage: '회원가입 되었습니다',
    errorMessage: '이미 존재하는 이메일입니다',
  });

  const onSubmit = handleSubmit((data) => {
    signUp(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">계정 만들기</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={onSubmit} className="space-y-4">
            <FormField
              label="이름"
              name="name"
              type="text"
              placeholder="John Doe"
              register={register('name')}
              error={errors.name?.message}
            />

            <FormField
              label="이메일"
              name="email"
              type="email"
              placeholder="your@email.com"
              register={register('email')}
              error={errors.email?.message}
            />

            <FormField
              label="비밀번호"
              name="password"
              type="password"
              placeholder="••••••"
              register={register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '가입 중...' : '가입하기'}
            </Button>
          </Form>

          <p className="text-center text-gray-600 text-sm mt-4">
            이미 계정이 있으신가요?{' '}
            <Link to="/sign-in" className="text-blue-600 hover:underline font-medium">
              로그인하기
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
