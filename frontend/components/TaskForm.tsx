"use client";

import { useEffect, useState } from "react";
import { EMPTY_DRAFT, Status, STATUS_OPTIONS, TaskDraft } from "@/lib/types";

const TIME_PRESETS = [15, 30, 60, 90, 120];

const STATUS_ACTIVE: Record<Status, string> = {
  Pending: "border-amber/50 bg-amber/10 text-amber",
  "In Progress": "border-sky/50 bg-sky/10 text-sky",
  Completed: "border-mint/50 bg-mint/10 text-mint",
};

const inputBase =
  "w-full rounded-md border border-ink-border bg-ink px-3 py-2.5 text-sm text-mist outline-none transition placeholder:text-mist-faint hover:border-ink-hover focus:border-mint focus:ring-2 focus:ring-mint/20";

interface TaskFormProps {
  mode: "create" | "edit";
  initialDraft?: TaskDraft;
  onSubmit: (draft: TaskDraft) => Promise<void> | void;
  onCancel?: () => void;
}

export default function TaskForm({
  mode,
  initialDraft,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(initialDraft ?? EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDraft(initialDraft ?? EMPTY_DRAFT);
  }, [initialDraft]);

  function updateItem(index: number, value: string) {
    const next = [...draft.items];
    next[index] = value;
    setDraft({ ...draft, items: next });
  }

  function addItem() {
    setDraft({ ...draft, items: [...draft.items, ""] });
  }

  function removeItem(index: number) {
    if (draft.items.length === 1) {
      setDraft({ ...draft, items: [""] });
      return;
    }
    setDraft({ ...draft, items: draft.items.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!draft.name.trim()) {
      setError("Add a task name or ticket ID to continue.");
      return;
    }
    const hasItem = draft.items.some((i) => i.trim().length > 0);
    if (!hasItem) {
      setError("Write at least one description line.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(draft);
      if (mode === "create") {
        setDraft(EMPTY_DRAFT);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const minutes = Number(draft.time) || 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-ink-border bg-ink-surface p-5 shadow-card"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-mist">
          {mode === "create" ? "New task" : "Editing task"}
        </h2>
        {mode === "edit" && (
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[11px] font-medium text-mint">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="task-name"
          className="text-xs font-medium text-mist-muted"
        >
          Task name{" "}
          <span className="text-mist-faint">
            — a ticket ID goes in this same box
          </span>
        </label>
        <input
          id="task-name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="e.g. Vanasthali Gyanpeeth  /  TCK-1042"
          className={inputBase}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-mist-muted">
          Description
        </label>
        {draft.items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2.5 w-6 shrink-0 text-right font-mono text-xs text-mist-faint">
              {index + 1}:-
            </span>
            <textarea
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="What did you do on this one?"
              rows={1}
              className={`min-h-[42px] flex-1 resize-y leading-relaxed ${inputBase}`}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="mt-1.5 shrink-0 rounded-md px-2 py-1.5 text-xs text-mist-faint transition hover:bg-ink-raised hover:text-coral"
              aria-label={`Remove description line ${index + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="self-start rounded-md border border-dashed border-ink-border px-2.5 py-1.5 text-xs font-medium text-mint transition hover:border-mint/50 hover:bg-mint/5"
        >
          + Add line
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-time" className="text-xs font-medium text-mist-muted">
            Time spent
          </label>
          <div className="relative">
            <input
              id="task-time"
              type="number"
              min={0}
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              placeholder="90"
              className={`pr-12 ${inputBase}`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-mist-faint">
              min
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDraft({ ...draft, time: String(preset) })}
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] transition ${
                  minutes === preset
                    ? "border-mint/50 bg-mint/10 text-mint"
                    : "border-ink-border text-mist-muted hover:border-ink-hover hover:text-mist"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-mist-muted">Status</span>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDraft({ ...draft, status: s })}
                aria-pressed={draft.status === s}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                  draft.status === s
                    ? STATUS_ACTIVE[s]
                    : "border-ink-border text-mist-muted hover:border-ink-hover hover:text-mist"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-ink-border pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-mint px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-mint-dim disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Add task"
              : "Save changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2.5 text-sm text-mist-muted transition hover:bg-ink-raised hover:text-mist"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
