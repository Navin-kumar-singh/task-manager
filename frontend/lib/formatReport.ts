import { Task } from "./types";

/**
 * Builds the end-of-day report.
 *
 * Time and Status always sit on their own line at the bottom of a task,
 * no matter how many description lines that task has.
 */
export function buildReport(tasks: Task[]): string {
  if (tasks.length === 0) {
    return "No tasks logged yet. Add a task to generate today's report.";
  }

  const totalTime = totalMinutes(tasks);
  const lines: string[] = ["Today's Task-"];

  tasks.forEach((task, index) => {
    lines.push(`    ${index + 1}- ${task.name}`);

    task.items.forEach((item, itemIndex) => {
      lines.push(`${itemIndex + 1}:- ${item.text}`);
    });

    lines.push(`    Time: ${task.time}min, Status: ${task.status}.`);
  });

  lines.push(`    Today's Task Total Time: ${totalTime}min`);
  lines.push("");
  lines.push("----------------------------------------");
  lines.push(`Total Working Time = ${totalTime}min`);
  lines.push("----------------------------------------");

  return lines.join("\n");
}

export function totalMinutes(tasks: Task[]): number {
  return tasks.reduce((sum, t) => sum + (Number(t.time) || 0), 0);
}

/** 90 -> "1h 30m", 45 -> "45m", 120 -> "2h" */
export function formatDuration(minutes: number): string {
  const mins = Math.max(0, Math.round(Number(minutes) || 0));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
