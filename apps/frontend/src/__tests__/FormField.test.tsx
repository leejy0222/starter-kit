import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormField } from '../components/FormField';

interface TestFormValues {
  email: string;
}

const TestWrapper = ({ error }: { error?: string }) => {
  const { register } = useForm<TestFormValues>();
  return (
    <FormField<TestFormValues>
      label="이메일"
      name="email"
      type="email"
      placeholder="test@example.com"
      register={register('email')}
      error={error}
      required
    />
  );
};

describe('FormField 컴포넌트', () => {
  it('label과 required 마크(*) 렌더링', () => {
    render(<TestWrapper />);
    expect(screen.getByText('이메일')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('에러 메시지 표시', () => {
    render(<TestWrapper error="올바른 이메일을 입력하세요" />);
    expect(screen.getByText('올바른 이메일을 입력하세요')).toBeInTheDocument();
  });

  it('에러 없을 때 에러 메시지 미표시', () => {
    render(<TestWrapper />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('placeholder 속성 전달', () => {
    render(<TestWrapper />);
    const input = screen.getByPlaceholderText('test@example.com') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe('test@example.com');
  });
});
