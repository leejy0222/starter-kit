import { FieldValues, Path, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from './ui/Input';
import clsx from 'clsx';

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormField = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required,
  disabled,
}: FormFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(error && 'border-red-500')}
        {...register}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const Form = ({ onSubmit, children, className }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={clsx('space-y-6', className)}>
      {children}
    </form>
  );
};
