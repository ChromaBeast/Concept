'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title = 'Example Implementation' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.trim().split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-obsidian-border bg-obsidian-surface overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-obsidian-card border-b border-obsidian-border text-xs text-dark-muted font-mono">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-electric" />
          <span className="text-dark-text font-medium">{title}</span>
          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-obsidian-surface border border-obsidian-border text-dark-muted">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-obsidian-surface text-dark-muted hover:text-white transition-colors"
          title="Copy snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0a0e17] text-gray-200">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                <td className="pr-4 py-0.5 text-right select-none text-dark-sub font-mono w-8 text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-0.5 whitespace-pre font-mono text-gray-200">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
