'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ListTree,
  FileCheck,
  Image as ImageIcon,
  Layers,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@/lib/authContext';
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
    <aside className="w-64 shrink-0 border-r border-paper-border bg-paper-card/80 backdrop-blur-md flex flex-col justify-between h-screen sticky top-0 font-sans text-xs select-none z-30">
      {/* Top Brand Header & Nav */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-paper-border flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ochre flex items-center justify-center font-bold text-white text-base shadow-sm font-mono shrink-0">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-paper-text font-sans leading-none">
                Concept Admin
              </span>
              <span className="text-[10px] text-paper-muted font-mono mt-0.5">Mission Control</span>
            </div>
          </div>
          <Badge variant="accent" className="text-[10px] px-1.5 py-0">v1.0</Badge>
        </div>

        {/* Nav Items */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-paper-muted uppercase font-mono px-3 mb-2.5 tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all group cursor-pointer text-left font-sans',
                    active
                      ? 'bg-ochre/15 text-ochre font-semibold shadow-sm border border-ochre/30'
                      : 'text-paper-muted hover:text-paper-text hover:bg-paper-surface'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4 transition-colors', active ? 'text-ochre' : 'text-paper-muted group-hover:text-paper-text')} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge variant={active ? 'accent' : 'outline'} className="text-[10px] font-mono px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile & Status Block */}
        <div className="p-4 border-t border-paper-border bg-paper-surface/40 space-y-3 font-mono shrink-0">
          <div className="p-2.5 rounded-xl border border-teal/25 bg-teal/10 flex items-center justify-between text-[11px] text-teal">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="font-bold">Cloud Engine</span>
            </div>
            <span className="font-medium">Active</span>
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
      </div>
    </aside>
  );
}
