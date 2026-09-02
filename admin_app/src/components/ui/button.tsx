import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-mono font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-sm cursor-pointer';

    const variants = {
      primary: 'bg-ochre hover:bg-ochre-dim text-white active:scale-[0.98]',
      secondary: 'bg-paper-card hover:bg-paper-surface text-paper-text border border-paper-border active:scale-[0.98]',
      outline: 'bg-transparent border border-paper-border text-paper-text hover:bg-paper-surface active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-paper-surface text-paper-muted hover:text-paper-text shadow-none',
      danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 active:scale-[0.98]',
      success: 'bg-teal/10 border border-teal/25 text-teal hover:bg-teal/20 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-xs px-4 py-2 gap-2',
      lg: 'text-sm px-6 py-3 gap-2.5',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
