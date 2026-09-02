import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-paper-border bg-paper-surface px-3 py-2 text-xs font-mono text-paper-text placeholder:text-paper-muted focus-visible:outline-none focus-visible:border-ochre focus-visible:ring-1 focus-visible:ring-ochre disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
