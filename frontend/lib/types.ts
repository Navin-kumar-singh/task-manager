export type Status = "Pending" | "In Progress" | "Completed";

export const STATUS_OPTIONS: Status[] = ["Pending", "In Progress", "Completed"];

export interface TaskItem {
  id: string;
  text: string;
}

export interface Task {
  id: string;
  /** Task name — a ticket ID can be typed straight into this same field. */
  name: string;
  /** Description lines for the task. */
  items: TaskItem[];
  time: number;
  status: Status;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDraft {
  name: string;
  items: string[];
  time: string;
  status: Status;
}

export const EMPTY_DRAFT: TaskDraft = {
  name: "",
  items: [""],
  time: "",
  status: "Pending",
};
