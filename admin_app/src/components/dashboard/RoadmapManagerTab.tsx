'use client';

import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Pagination } from '../ui/pagination';
import { adminApi } from '@/lib/adminApi';
import { RoadmapTopic } from '@/lib/types';

const PAGE_SIZE = 15;

export function RoadmapManagerTab() {
  const [topics, setTopics] = useState<RoadmapTopic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ topic: '', category: 'system_design', difficulty: 'intermediate', priority: 1 });

  const loadTopics = async () => {
    setLoading(true);
    const res = await adminApi.getRoadmapTopics(selectedCategory, selectedStatus, page, PAGE_SIZE);
    setTopics(res.items);
    setTotal(res.total);
    setLoading(false);
  };

  useEffect(() => {
    loadTopics();
  }, [selectedCategory, selectedStatus, page]);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.topic.trim()) return;
    await adminApi.addRoadmapTopic(newTopic);
    setNewTopic({ topic: '', category: 'system_design', difficulty: 'intermediate', priority: 1 });
    setOpenModal(false);
    loadTopics();
  };

  const handleRetry = async (id: string) => {
    await adminApi.retryRoadmapTopic(id);
    loadTopics();
  };

  const handleDelete = async (id: string) => {
    await adminApi.deleteRoadmapTopic(id);
    loadTopics();
  };

  const filteredTopics = search.trim()
    ? topics.filter((t) => t.topic.toLowerCase().includes(search.toLowerCase()))
    : topics;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-paper-border bg-paper-card shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-paper-muted" />
            <Input
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
            className="h-10 rounded-xl border border-paper-border bg-paper-surface px-3 text-xs font-mono text-paper-text"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="claimed">Claimed</option>
            <option value="done">Done</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-paper-muted font-mono hidden md:inline">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}
          </span>

          <Button size="sm" variant="secondary" onClick={loadTopics} loading={loading}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Roadmap Topic</DialogTitle>
                <DialogDescription>Queue a topic for automated Gemini pipeline synthesis.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTopic} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-paper-text">Topic Name</label>
                  <Input
                    placeholder="e.g. Distributed Consensus (Raft)"
                    value={newTopic.topic}
                    onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-paper-text">Category</label>
                    <select
                      value={newTopic.category}
                      onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                      className="w-full h-10 rounded-xl border border-paper-border bg-paper-surface px-3 text-xs text-paper-text"
                    >
                      <option value="dsa">DSA</option>
                      <option value="system_design">System Design</option>
                      <option value="databases">Databases</option>
                      <option value="operating_systems">OS</option>
                      <option value="networking">Networking</option>
                      <option value="backend">Backend</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-paper-text">Difficulty</label>
                    <select
                      value={newTopic.difficulty}
                      onChange={(e) => setNewTopic({ ...newTopic, difficulty: e.target.value })}
                      className="w-full h-10 rounded-xl border border-paper-border bg-paper-surface px-3 text-xs text-paper-text"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Create &amp; Queue Topic
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((item) => (
              <TableRow key={item.$id}>
                <TableCell className="font-semibold text-paper-text">{item.topic}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                <TableCell className="capitalize text-paper-muted">{item.difficulty}</TableCell>
                <TableCell>
                  {item.status === 'done' && <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Done</Badge>}
                  {item.status === 'pending' && <Badge variant="default"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                  {item.status === 'claimed' && <Badge variant="accent"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Synthesizing</Badge>}
                  {item.status === 'failed' && <Badge variant="error"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</Badge>}
                </TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {item.status === 'failed' && (
                      <button onClick={() => handleRetry(item.$id)} className="p-1 text-ochre hover:bg-paper-surface rounded">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.$id)} className="p-1 text-rose-500 hover:bg-paper-surface rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-paper-muted">
                {loading ? 'Loading paginated roadmap topics...' : 'No topics found matching current filters.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="pt-2">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
