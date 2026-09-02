'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ListTree, FileCheck, Image as ImageIcon, Layers, Cpu, Play } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { adminApi } from '@/lib/adminApi';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: string) => void;
}

export function CommandMenuDialog({ open, onOpenChange, onNavigate }: CommandMenuProps) {
  const [topics, setTopics] = useState<{ id: string; topic: string; category: string }[]>([]);

  useEffect(() => {
    if (open) {
      adminApi.getRoadmapTopics().then((res) => {
        setTopics(res.slice(0, 15).map((t) => ({ id: t.$id, topic: t.topic, category: t.category })));
      });
    }
  }, [open]);

  const select = (tab: string) => {
    onNavigate(tab);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search topic..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => select('overview')}>
            <Cpu className="w-4 h-4 mr-2 text-ochre" />
            <span>Dashboard Overview</span>
          </CommandItem>
          <CommandItem onSelect={() => select('pipeline')}>
            <Sparkles className="w-4 h-4 mr-2 text-ochre" />
            <span>Gemini AI Pipeline Console</span>
          </CommandItem>
          <CommandItem onSelect={() => select('roadmap')}>
            <ListTree className="w-4 h-4 mr-2 text-ochre" />
            <span>Roadmap Topics Queue</span>
          </CommandItem>
          <CommandItem onSelect={() => select('concepts')}>
            <FileCheck className="w-4 h-4 mr-2 text-ochre" />
            <span>Concept Review &amp; Triage</span>
          </CommandItem>
          <CommandItem onSelect={() => select('media')}>
            <ImageIcon className="w-4 h-4 mr-2 text-ochre" />
            <span>Visual Aid Studio</span>
          </CommandItem>
          <CommandItem onSelect={() => select('courses')}>
            <Layers className="w-4 h-4 mr-2 text-ochre" />
            <span>Study Tracks</span>
          </CommandItem>
        </CommandGroup>

        {topics.length > 0 && (
          <CommandGroup heading="Recent Roadmap Topics">
            {topics.map((t) => (
              <CommandItem key={t.id} onSelect={() => select('roadmap')}>
                <ListTree className="w-4 h-4 mr-2 text-paper-muted" />
                <span className="font-semibold">{t.topic}</span>
                <span className="ml-auto text-[10px] text-paper-muted font-mono">{t.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
