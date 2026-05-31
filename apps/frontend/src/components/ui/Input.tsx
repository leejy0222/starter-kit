import clsx from 'clsx';
import React from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border border-gray-300 rounded',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
