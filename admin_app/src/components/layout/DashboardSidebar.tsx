'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ListTree,
  FileCheck,
  Image as ImageIcon,
  Layers,
  Database,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@/lib/authContext';
import { APPWRITE_CONFIG } from '@/lib/appwrite';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (id: string) => void;
  stats?: { totalConcepts: number; totalRoadmap: number; totalCourses: number };
}

export function DashboardSidebar({ currentTab, onSelectTab, stats }: SidebarProps) {
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pipeline', label: 'AI Pipeline', icon: Sparkles },
    { id: 'roadmap', label: 'Roadmap Queue', icon: ListTree, badge: stats?.totalRoadmap || 155 },
    { id: 'concepts', label: 'Review & Triage', icon: FileCheck, badge: stats?.totalConcepts || 18 },
    { id: 'media', label: 'Image Studio', icon: ImageIcon },
    { id: 'courses', label: 'Study Tracks', icon: Layers, badge: stats?.totalCourses || 3 },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-paper-border bg-paper-card/70 backdrop-blur-md flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 font-sans text-xs select-none">
      {/* Top Nav List */}
      <div className="p-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-paper-muted uppercase font-mono px-3 mb-2 tracking-wider">
            Platform Engine
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all group cursor-pointer text-left',
                  active
                    ? 'bg-ochre/15 text-ochre font-bold shadow-sm border border-ochre/30'
                    : 'text-paper-muted hover:text-paper-text hover:bg-paper-surface'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-4 h-4', active ? 'text-ochre' : 'text-paper-muted group-hover:text-paper-text')} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <Badge variant={active ? 'accent' : 'outline'} className="text-[10px] px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Status */}
      <div className="p-4 border-t border-paper-border bg-paper-surface/40 space-y-3 font-mono">
        <div className="p-2.5 rounded-xl border border-teal/25 bg-teal/10 flex items-center justify-between text-[11px] text-teal">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="font-bold">Cloud Engine</span>
          </div>
          <span>Active</span>
        </div>

        {user && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="w-7 h-7">
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="font-bold text-paper-text text-xs truncate font-sans">{user.name}</span>
                <span className="text-[10px] text-paper-muted truncate">{user.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-paper-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
