import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StreakBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  streakDays: number;
}

export function StreakBadge({ streakDays, className, ...props }: StreakBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-ochre/10 border border-ochre/25 text-ochre select-none shadow-sm',
        className
      )}
      title={`${streakDays} Day Learning Streak`}
      {...props}
    >
      <Flame className="w-3.5 h-3.5 fill-ochre text-ochre" />
      <span>{streakDays}d</span>
    </div>
  );
}
