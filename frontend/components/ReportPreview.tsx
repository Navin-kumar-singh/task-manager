"use client";

import { useState } from "react";

interface ReportPreviewProps {
  report: string;
  taskCount: number;
  totalTime: number;
  onRemoveAll: () => void;
  disabled: boolean;
}

export default function ReportPreview({
  report,
  taskCount,
  totalTime,
  onRemoveAll,
  disabled,
}: ReportPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fall back to manual selection.
    }
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-ink-border bg-ink-surface shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-border bg-ink-raised/40 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-mist">Today&apos;s report</h2>
          <p className="mt-0.5 font-mono text-[11px] text-mist-faint">
            {taskCount} {taskCount === 1 ? "task" : "tasks"} · {totalTime}min
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={disabled}
            className="rounded-md bg-mint px-3 py-2 text-xs font-semibold text-ink transition hover:bg-mint-dim disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy all"}
          </button>
          <button
            onClick={onRemoveAll}
            disabled={disabled}
            className="rounded-md border border-ink-border px-3 py-2 text-xs font-medium text-mist-muted transition hover:border-coral/50 hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
          >
            Remove all
          </button>
        </div>
      </header>

      <pre className="flex-1 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[12.5px] leading-relaxed text-mist/90">
        {report}
      </pre>
    </section>
  );
}
