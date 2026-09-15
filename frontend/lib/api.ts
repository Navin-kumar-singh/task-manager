mport { Task, TaskDraft } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse failure, use default message
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function draftToPayload(draft: TaskDraft) {
  return {
    name: draft.name.trim(),
    items: draft.items.filter((t) => t.trim().length > 0),
    time: Number(draft.time) || 0,
    status: draft.status,
  };
}

export const api = {
  list(): Promise<Task[]> {
    return fetch(`${API_URL}/api/tasks`).then((r) => handle<Task[]>(r));
  },

  create(draft: TaskDraft): Promise<Task> {
    return fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftToPayload(draft)),
    }).then((r) => handle<Task>(r));
  },

  update(id: string, draft: TaskDraft): Promise<Task> {
    return fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftToPayload(draft)),
    }).then((r) => handle<Task>(r));
  },

  duplicate(id: string): Promise<Task> {
    return fetch(`${API_URL}/api/tasks/${id}/duplicate`, {
      method: "POST",
    }).then((r) => handle<Task>(r));
  },

  remove(id: string): Promise<void> {
    return fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
    }).then((r) => handle<void>(r));
  },

  removeAll(): Promise<void> {
    return fetch(`${API_URL}/api/tasks`, {
      method: "DELETE",
    }).then((r) => handle<void>(r));
  },
};
