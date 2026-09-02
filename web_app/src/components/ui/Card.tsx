import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: string;
  hoverable?: boolean;
}

export function Card({ className, accentColor, hoverable = false, children, style, ...props }: CardProps) {
  const dynamicStyle = accentColor
    ? {
        borderLeftColor: accentColor,
        borderLeftWidth: '3.5px',
        ...style,
      }
    : style;

  return (
    <div
      className={cn(
        'bg-dark-card border border-dark-border rounded-xl p-5 text-dark-text transition-all duration-200 shadow-sm relative overflow-hidden',
        hoverable && 'hover:border-dark-muted/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </div>
  );
}
