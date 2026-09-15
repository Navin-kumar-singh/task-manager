const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, "data", "tasks.json");

app.use(cors());
app.use(express.json());

// ---------- storage helpers ----------
function ensureDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]", "utf-8");
}

function stripLegacyFields(task) {
  // Older saved tasks may still carry ticketId / intro — drop them,
  // folding any ticket ID into the task name so nothing is lost.
  const { ticketId, intro, ...rest } = task || {};
  if (ticketId && String(ticketId).trim()) {
    const ticket = String(ticketId).trim();
    const name = String(rest.name || "").trim();
    rest.name = name ? `${name} ${ticket}` : ticket;
  }
  return rest;
}

function readTasks() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(stripLegacyFields) : [];
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((it) => (typeof it === "string" ? it : it && it.text))
    .filter((text) => typeof text === "string" && text.trim().length > 0)
    .map((text) => ({ id: uuidv4(), text: text.trim() }));
}

// ---------- routes ----------

// Get all tasks, ordered by creation
app.get("/api/tasks", (req, res) => {
  const tasks = readTasks().sort((a, b) => a.order - b.order);
  res.json(tasks);
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const { name, items, time, status } = req.body;

  if (!name || !String(name).trim()) {
    return res
      .status(400)
      .json({ error: "Add a task name or ticket ID to continue." });
  }

  const tasks = readTasks();
  const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order ?? 0), 0);

  const task = {
    id: uuidv4(),
    name: String(name).trim(),
    items: normalizeItems(items),
    time: Number(time) || 0,
    status: status || "Pending",
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  const { name, items, time, status } = req.body;
  const existing = tasks[idx];

  const updated = {
    ...existing,
    name: name !== undefined ? String(name).trim() : existing.name,
    items: items !== undefined ? normalizeItems(items) : existing.items,
    time: time !== undefined ? Number(time) || 0 : existing.time,
    status: status !== undefined ? status : existing.status,
    updatedAt: new Date().toISOString(),
  };

  tasks[idx] = updated;
  writeTasks(tasks);
  res.json(updated);
});

// Duplicate a single task
app.post("/api/tasks/:id/duplicate", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const source = tasks.find((t) => t.id === id);

  if (!source) {
    return res.status(404).json({ error: "Task not found." });
  }

  const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order ?? 0), 0);
  const copy = {
    ...source,
    id: uuidv4(),
    name: `${source.name} (Copy)`,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: source.items.map((it) => ({ id: uuidv4(), text: it.text })),
  };

  tasks.push(copy);
  writeTasks(tasks);
  res.status(201).json(copy);
});

// Delete a single task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const next = tasks.filter((t) => t.id !== id);

  if (next.length === tasks.length) {
    return res.status(404).json({ error: "Task not found." });
  }

  writeTasks(next);
  res.status(204).end();
});

// Delete all tasks
app.delete("/api/tasks", (req, res) => {
  writeTasks([]);
  res.status(204).end();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Task manager API running on http://localhost:${PORT}`);
});
