# Daily Task Log

A small full-stack task manager for logging what you worked on each day and
generating a shareable end-of-day report in one click.

- **Backend:** Node.js + Express, tasks stored in a local JSON file (`backend/data/tasks.json`) — no database setup needed.
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS.

## Features

- Add a task with: task name (a ticket ID goes in the same field), description lines, time spent, and status.
- Edit any task.
- Duplicate a task.
- Delete a single task, or remove all tasks at once.
- Live-generated report in the exact "Today's Task-" format, with a one-click **Copy all** button.

## Quick start (from the project root)

```bash
npm i
npm start
```

That's it — `npm i` installs the root tooling and then automatically installs
both `backend/` and `frontend/`. `npm start` runs both servers together:

- Backend API: http://localhost:5000
- Frontend app: http://localhost:3000

Open http://localhost:3000 in your browser.

## Running each side separately (optional)

```bash
# Terminal 1
cd backend
npm i
npm start

# Terminal 2
cd frontend
npm i
npm run dev
```

## Project structure

```
task-manager/
├── backend/
│   ├── server.js         # Express app + CRUD routes
│   └── data/tasks.json   # File-based storage (auto-created)
├── frontend/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # TaskForm, TaskCard, ReportPreview
│   └── lib/                # API client, types, report formatter
└── package.json           # Root scripts to run both together
```

## API reference

| Method | Endpoint                  | Description          |
|--------|----------------------------|-----------------------|
| GET    | `/api/tasks`               | List all tasks        |
| POST   | `/api/tasks`                | Create a task         |
| PUT    | `/api/tasks/:id`            | Update a task         |
| POST   | `/api/tasks/:id/duplicate`  | Duplicate a task      |
| DELETE | `/api/tasks/:id`            | Delete one task       |
| DELETE | `/api/tasks`                | Delete all tasks      |

## Report format

Given the tasks you enter, the app generates:

```
Today's Task-
    1- Vanasthali Gyanpeeth
1:- Dynamic the Guiding Principle page...
2:- Dynamic the Our Leadership section...
    Time: 90min, Status: Pending.
    Today's Task Total Time: 90min

----------------------------------------
Total Working Time = 90min
----------------------------------------
```

There is no intro line. Time and Status always print on their own line at the
bottom of each task, however many description lines it has.
