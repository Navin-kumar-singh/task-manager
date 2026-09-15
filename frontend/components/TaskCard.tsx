"use client";

import { Task } from "@/lib/types";
import { formatDuration } from "@/lib/formatReport";
import StatusBadge from "./StatusBadge";

interface TaskCardProps {
  task: Task;
  index: number;
  isEditing: boolean;
  onEdit: (task: Task) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  index,
  isEditing,
  onEdit,
  onDuplicate,
  onDelete,
}: TaskCardProps) {
  return (
    <article
      className={`animate-fade-up rounded-lg border bg-ink-surface shadow-card transition-colors ${
        isEditing
          ? "border-mint/50 bg-mint/[0.03]"
          : "border-ink-border hover:border-ink-hover"
      }`}
    >
      <div className="flex items-start gap-3 px-4 pt-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-raised font-mono text-[11px] text-mist-muted">
          {index + 1}
        </span>
        <h3 className="flex-1 break-words pt-0.5 text-[15px] font-semibold leading-snug text-mist">
          {task.name}
        </h3>
      </div>

      {task.items.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2 px-4">
          {task.items.map((item, i) => (
            <li key={item.id} className="flex gap-2.5 text-sm leading-relaxed text-mist/90">
              <span className="shrink-0 font-mono text-xs leading-6 text-mist-faint">
                {i + 1}:-
              </span>
              <span className="break-words">{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Time + Status always sit here, at the bottom of the task. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-ink-border bg-ink px-2.5 py-1 font-mono text-[11px] text-mist-muted">
            {task.time}min
            {task.time >= 60 && (
              <span className="text-mist-faint"> · {formatDuration(task.time)}</span>
            )}
          </span>
          <StatusBadge status={task.status} />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => onEdit(task)}
            className="rounded-sm px-2 py-1 text-mist-muted transition hover:bg-ink-raised hover:text-mint"
          >
            Edit
          </button>
          <button
            onClick={() => onDuplicate(task.id)}
            className="rounded-sm px-2 py-1 text-mist-muted transition hover:bg-ink-raised hover:text-mint"
          >
            Duplicate
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-sm px-2 py-1 text-mist-muted transition hover:bg-ink-raised hover:text-coral"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
