import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  accentColor?: string;
}

export function Card({
  className,
  hoverable = false,
  accentColor,
  children,
  style,
  ...props
}: CardProps) {
  const dynamicStyle = accentColor
    ? {
        borderLeftColor: accentColor,
        borderLeftWidth: '3px',
        ...style,
      }
    : style;

  return (
    <div
      className={cn(
        'bg-paper-card border border-paper-border rounded-2xl p-5 text-paper-text transition-all duration-200 shadow-sm relative overflow-hidden',
        hoverable && 'hover:border-ochre/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 space-y-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-bold text-paper-text tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-xs text-paper-muted leading-relaxed', className)} {...props}>
      {children}
    </div>
  );
}
