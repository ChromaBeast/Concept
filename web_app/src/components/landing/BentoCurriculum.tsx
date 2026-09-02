'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Network, Layers, ShieldCheck } from 'lucide-react';

const DOMAINS = [
  {
    id: 'core_cs',
    title: 'Core Computer Science',
    icon: Cpu,
    tag: 'FOUNDATIONS',
    count: '64 Concepts',
    color: '#58A6FF',
    description: 'Data structures, algorithm paradigms, memory managers, process scheduling, and epoll I/O multiplexing.',
    topics: ['Binary Search', 'Virtual Memory', 'Graph BFS/DFS', 'LRU Cache'],
  },
  {
    id: 'systems_cloud',
    title: 'Distributed Systems & Cloud',
    icon: Network,
    tag: 'SCALE',
    count: '52 Concepts',
    color: '#BC8CFF',
    description: 'CAP Theorem, consistent hashing rings, write-ahead logging, database sharding, and message streams.',
    topics: ['Consistent Hashing', 'Database Sharding', 'Raft Consensus', 'Rate Limiters'],
  },
  {
    id: 'software_web',
    title: 'Software & Web Engineering',
    icon: Layers,
    tag: 'APPLICATIONS',
    count: '48 Concepts',
    color: '#39C5CF',
    description: 'Dependency injection, circuit breakers, idempotency keys, REST/gRPC/GraphQL, and event sourcing.',
    topics: ['Circuit Breaker', 'Dependency Injection', 'Idempotency', 'Event Sourcing'],
  },
  {
    id: 'practices_career',
    title: 'Reliability & Staff+ Strategy',
    icon: ShieldCheck,
    tag: 'OPERATIONS',
    count: '33 Concepts',
    color: '#56D364',
    description: 'Zero-downtime blue/green deployments, SQL vs NoSQL trade-offs, OWASP security, and system design interviews.',
    topics: ['Blue-Green Deploy', 'ACID vs BASE', 'SQL Injection', 'Trade-off Pitching'],
  },
];

export function BentoCurriculum() {
  return (
    <section className="py-20 border-t border-obsidian-border bg-obsidian-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 02 / DOMAINS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              DISCOVER CURRICULUM <br />
              <span className="text-electric">BUILT FOR EVERY LAYER</span>
            </h2>
          </div>

          <p className="text-sm text-dark-muted max-w-md">
            Organized into 4 high-level domain clusters so you never suffer from choice fatigue.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                className="group relative p-8 rounded-3xl border border-obsidian-border bg-obsidian-card hover:border-electric/40 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                        style={{ backgroundColor: `${domain.color}20`, color: domain.color, border: `1px solid ${domain.color}40` }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold tracking-wider text-dark-muted uppercase">
                        {domain.tag}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-obsidian-surface border border-obsidian-border text-dark-text">
                      {domain.count}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-dark-text group-hover:text-electric transition-colors">
                    {domain.title}
                  </h3>

                  <p className="text-sm text-dark-muted leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-obsidian-border/60">
                  <div className="flex flex-wrap gap-2">
                    {domain.topics.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-obsidian-surface border border-obsidian-border text-dark-muted"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/browse?domain=${domain.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-electric uppercase tracking-wider group-hover:underline"
                  >
                    <span>Explore Domain Track</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
