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
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 select-none shadow-sm',
        className
      )}
      title={`${streakDays} Day Learning Streak`}
      {...props}
    >
      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
      <span>{streakDays}d streak</span>
    </div>
  );
}
