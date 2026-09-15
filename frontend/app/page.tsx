"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import ReportPreview from "@/components/ReportPreview";
import { api } from "@/lib/api";
import { buildReport, formatDuration, totalMinutes } from "@/lib/formatReport";
import { EMPTY_DRAFT, Task, TaskDraft } from "@/lib/types";

function taskToDraft(task: Task): TaskDraft {
  return {
    name: task.name,
    items: task.items.length > 0 ? task.items.map((i) => i.text) : [""],
    time: String(task.time),
    status: task.status,
  };
}

const TODAY = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.list();
      setTasks(data);
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? `Couldn't reach the backend: ${err.message}. Is it running on port 5000?`
          : "Couldn't reach the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(draft: TaskDraft) {
    const created = await api.create(draft);
    setTasks((prev) => [...prev, created]);
  }

  async function handleUpdate(draft: TaskDraft) {
    if (!editingId) return;
    const updated = await api.update(editingId, draft);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingId(null);
  }

  async function handleDuplicate(id: string) {
    const copy = await api.duplicate(id);
    setTasks((prev) => [...prev, copy]);
  }

  async function handleDelete(id: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
    try {
      await api.remove(id);
    } catch {
      setTasks(previous);
    }
  }

  async function handleRemoveAll() {
    if (tasks.length === 0) return;
    const confirmed = window.confirm(
      "Remove all tasks? This clears today's entire log."
    );
    if (!confirmed) return;

    const previous = tasks;
    setTasks([]);
    setEditingId(null);
    try {
      await api.removeAll();
    } catch {
      setTasks(previous);
    }
  }

  const editingTask = useMemo(
    () => tasks.find((t) => t.id === editingId) ?? null,
    [tasks, editingId]
  );

  const report = useMemo(() => buildReport(tasks), [tasks]);
  const total = useMemo(() => totalMinutes(tasks), [tasks]);
  const doneCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink-border pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-mist sm:text-[28px]">
            Daily task log
          </h1>
          <p className="mt-1 text-sm text-mist-muted">{TODAY}</p>
        </div>

        <dl className="flex items-stretch gap-2">
          <div className="rounded-lg border border-ink-border bg-ink-surface px-4 py-2.5 shadow-card">
            <dt className="text-[11px] text-mist-faint">Total time</dt>
            <dd className="font-mono text-lg leading-tight text-mint">
              {formatDuration(total)}
            </dd>
          </div>
          <div className="rounded-lg border border-ink-border bg-ink-surface px-4 py-2.5 shadow-card">
            <dt className="text-[11px] text-mist-faint">Tasks</dt>
            <dd className="font-mono text-lg leading-tight text-mist">
              {doneCount}
              <span className="text-mist-faint">/{tasks.length}</span>
            </dd>
          </div>
        </dl>
      </header>

      {loadError && (
        <div className="mb-6 rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
          {loadError}
          <button
            onClick={loadTasks}
            className="ml-2 font-semibold underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-5">
          <TaskForm
            key={editingId ?? "create"}
            mode={editingTask ? "edit" : "create"}
            initialDraft={editingTask ? taskToDraft(editingTask) : EMPTY_DRAFT}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={editingTask ? () => setEditingId(null) : undefined}
          />

          <div className="flex flex-col gap-3">
            {loading && (
              <div className="rounded-lg border border-ink-border bg-ink-surface p-6 text-center text-sm text-mist-muted">
                Loading tasks…
              </div>
            )}
            {!loading && tasks.length === 0 && !loadError && (
              <div className="rounded-lg border border-dashed border-ink-border p-8 text-center">
                <p className="text-sm font-medium text-mist">
                  Nothing logged yet today
                </p>
                <p className="mt-1 text-sm text-mist-muted">
                  Add your first task above and the report builds itself.
                </p>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                isEditing={editingId === task.id}
                onEdit={(t) => setEditingId(t.id)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-10 lg:h-[calc(100vh-5rem)]">
          <ReportPreview
            report={report}
            taskCount={tasks.length}
            totalTime={total}
            onRemoveAll={handleRemoveAll}
            disabled={tasks.length === 0}
          />
        </div>
      </div>
    </main>
  );
}
