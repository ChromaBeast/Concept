import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-paper-border bg-paper-surface px-3 py-2 text-xs font-mono text-paper-text placeholder:text-paper-muted focus-visible:outline-none focus-visible:border-ochre focus-visible:ring-1 focus-visible:ring-ochre disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
