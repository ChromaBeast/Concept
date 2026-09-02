'use client';

import React from 'react';

const ITEMS = [
  'SYSTEM DESIGN',
  'DISTRIBUTED CONSENSUS',
  'CONCURRENCY PRIMITIVES',
  'DATABASE INTERNALS',
  'EPPOLL & I/O MULTIPLEXING',
  'ZERO-DOWNTIME DEPLOYMENT',
  'STAFF+ INTERVIEW ANGLES',
  'B-TREES VS LSM-TREES',
  'CONSISTENT HASHING',
  'CIRCUIT BREAKERS',
  'MEMORY MANAGERS',
  'QUIC & HTTP/3',
];

export function TickerMarquee() {
  return (
    <div className="w-full bg-electric text-obsidian-bg py-2.5 overflow-hidden border-y border-electric/40 select-none">
      <div className="flex w-fit whitespace-nowrap animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center mx-4 text-xs sm:text-sm font-black tracking-wider uppercase">
            <span>{item}</span>
            <span className="mx-4 text-obsidian-bg/60 font-mono">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
