# University Student Task Manager

A web app where a student adds their courses, then tracks every assignment with
a due date and a priority, and sees at a glance what is overdue and what is due
this week.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [API endpoints](#api-endpoints)
- [Frontend routes](#frontend-routes)
- [Project structure](#project-structure)
- [The shared design system](#the-shared-design-system)
- [Branching](#branching)
- [Data model](#data-model)
- [Troubleshooting](#troubleshooting)

---

## Tech stack

| Layer    | Choice                                |
| -------- | ------------------------------------- |
| Frontend | React 18 (JavaScript) + Vite          |
| Routing  | React Router 6                        |
| Styling  | Plain CSS + design tokens (see below) |
| Icons    | lucide-react                          |
| Backend  | Node.js + Express                     |
| Database | MySQL 8 (`mysql2` driver)             |

---

## Getting started

You need **Node.js 18+** and **MySQL 8** running locally.

### 1. Clone

```bash
git clone https://github.com/Sammiele224/student-task-manager.git
cd student-task-manager
```

### (2). If NO DOCKER DESKTOP INSTALLED, create the database manually; otherwise, skip this step

First, you need to install and set up MySQL 8.

Then, run the SQL script to create the database and tables:

```bash
mysql -u root -p < backend/db/schema.sql
```

Creates `student_task_manager` with the `courses` and `tasks` tables. Safe to
re-run — every statement uses `IF NOT EXISTS`.

Then, run the SQL script to seed data:

```bash
mysql -u root -p < backend/db/seed.sql
```
### 3. Start the backend 

```bash
cd backend
cp .env.example .env      # then fill in your MySQL password

docker-compose up -d       # only if you use Docker

npm install
npm run dev               # http://localhost:4000
```
NOTE: if you're using Docker, MySQL password in .env should be the same as `MYSQL_ROOT_PASSWORD` in `docker-compose.yml`. 

Check it worked: <http://localhost:4000/api/health> returns
`{"status":"ok","database":"connected"}`.

### 4. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Vite proxies every `/api/*` request to the backend on port 4000, so frontend
code just calls `fetch('/api/courses')` — no host, no CORS handling.

### Commands

| Where      | Command         | What it does                   |
| ---------- | --------------- | ------------------------------ |
| `frontend` | `npm run dev`   | Dev server with hot reload     |
| `frontend` | `npm run build` | Production build into `dist/`  |
| `frontend` | `npm run lint`  | ESLint                         |
| `backend`  | `npm run dev`   | API server, restarts on save   |
| `backend`  | `npm start`     | API server, no watch           |

---

## API endpoints

```
GET    /api/courses                list courses
POST   /api/courses                create course
PUT    /api/courses/:id            update course
DELETE /api/courses/:id            delete course

GET    /api/tasks                  list tasks
                                   ?search= &courseId= &status= &priority= &sort=dueDate
POST   /api/tasks                  create task
GET    /api/tasks/:id              one task
PUT    /api/tasks/:id              update task
DELETE /api/tasks/:id              delete task
PATCH  /api/tasks/:id/status       change status only

GET    /api/stats                  dashboard numbers
GET    /api/health                 server + database check
```

### Conventions

| Thing             | Convention                                                      |
| ----------------- | --------------------------------------------------------------- |
| **Dates**         | ISO `YYYY-MM-DD` everywhere — request, response, database         |
| **Field names**   | `camelCase` in JSON (`courseId`, `dueDate`), `snake_case` in SQL |
| **Priority**      | `"low"` \| `"medium"` \| `"high"`                                |
| **Status**        | `"todo"` \| `"in_progress"` \| `"done"`                          |
| **Errors**        | Non-2xx with `{ "error": "A human-readable message" }`           |
| **Overdue**       | `due_date < today AND status != 'done'`                          |
| **Due this week** | `due_date` within the next 7 days, inclusive of today            |

### `GET /api/stats` response shape

```json
{
  "totalTasks": 35,
  "completedTasks": 22,
  "overdueTasks": 3,
  "dueThisWeek": 8,
  "completionRate": 62
}
```

---

## Frontend routes

| Path         | Page        |
| ------------ | ----------- |
| `/`          | Overview    |
| `/dashboard` | → redirects to `/` |
| `/courses`   | My courses  |
| `/tasks`     | All tasks   |
| `/tasks/:id` | Task detail |
| `/upcoming`  | Upcoming    |
| `/calendar`  | Calendar    |

---

## Project structure

```
student-task-manager/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/          Button, Input, Select, Card, Badge  ← reuse these
│       │   └── layout/      AppLayout, Sidebar, Topbar, PageContainer, PageHeader
│       ├── pages/           One file per route
│       ├── styles/          tokens.css (colours, type, spacing) + global.css
│       ├── theme/           Light / Cyber theme provider
│       ├── App.jsx          Route table
│       └── main.jsx         Entry point
│
└── backend/
    ├── db/
    │   ├── schema.sql       Tables (run this first)
    │   └── seed.sql         Demo data
    └── src/
        ├── server.js        Express app — add routers here
        └── db.js            Shared MySQL connection pool
```

---

## The shared design system

**Reuse these components. Please do not hand-roll buttons, inputs or card
surfaces** — if something is missing, extend the shared component so everything
stays consistent.

### Components

```jsx
import { Button, Input, Select, Card, Badge } from '../components/ui'
import { PageContainer, PageHeader } from '../components/layout'
```

| Component | Key props                                                                 |
| --------- | ------------------------------------------------------------------------- |
| `Button`  | `variant` `primary\|secondary\|ghost\|danger`, `size` `sm\|md\|lg`, `iconLeft`, `iconRight`, `loading`, `fullWidth`, `as` |
| `Input`   | `label`, `hint`, `error`, `required`, `optional`, `icon`, `as="textarea"`  |
| `Select`  | `label`, `options={[{value,label}]}`, `placeholder`, `error`, `required`   |
| `Card`    | `eyebrow`, `title`, `action`, `footer`, `padding` `none\|sm\|md\|lg`, `tone` `default\|subtle\|outline`, `hoverable` |
| `Badge`   | `tone` `neutral\|accent\|high\|medium\|low\|overdue\|done`, `dot`          |

`Badge` carries the status colours: `overdue` and `high` are red, `medium`
amber, `low` and `done` green.

### What a page looks like

Every page follows the same skeleton — this is what keeps the app feeling like
one product:

```jsx
import { Plus } from 'lucide-react'
import { Button, Card } from '../components/ui'
import { PageContainer, PageHeader } from '../components/layout'

export default function Courses() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Your academic world"
        title="A home for every course."
        subtitle="Keep your subjects organized."
        actions={<Button iconLeft={<Plus />}>New course</Button>}
      />

      <Card title="Software Engineering" eyebrow="CS301">
        ...
      </Card>
    </PageContainer>
  )
}
```

### Adding a page

Three edits, nothing else:

1. Create `src/pages/YourPage.jsx`.
2. Add a `<Route>` in `src/App.jsx`.
3. Add an entry to `NAV_ITEMS` in `src/components/layout/Sidebar.jsx`.

### Colours and spacing

`src/styles/tokens.css` is the single source of truth. **Never hard-code a
colour** — use the variable and both themes work for free:

```css
.my-thing {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

| Purpose             | Variable                                                     |
| ------------------- | ------------------------------------------------------------ |
| Page / card / panel | `--bg-page`, `--bg-surface`, `--bg-surface-subtle`           |
| Text                | `--text-primary`, `--text-secondary`, `--text-muted`          |
| Brand action        | `--accent`, `--accent-hover`, `--accent-contrast`, `--accent-soft` |
| Status              | `--danger`, `--warning`, `--success` (+ each `-soft`)         |
| Course colours      | `--course-green`, `--course-purple`, `--course-amber`, `--course-blue` |
| Borders             | `--border`, `--border-strong`                                 |
| Spacing             | `--space-1` … `--space-16` (4px scale)                        |
| Radii               | `--radius-sm\|md\|lg\|xl\|pill`                               |

### Themes

Two themes: **Light** (warm paper, forest green) and **Cyber** (near-black,
mint). The switch is at the bottom of the sidebar. It follows the operating
system preference until someone picks one, then remembers it.

Because everything reads from tokens, you never write theme-specific CSS.

> **Styling approach is not final.** Plain CSS keeps the door open — the token
> palette maps directly onto a Tailwind theme config later, and only component
> files would change.

---

## Branching

`main` is protected: no direct pushes, and every pull request needs one
approving review before it can merge.

```bash
git checkout main
git pull
git checkout -b feature/task-create

# ...work, commit...

git push -u origin feature/task-create
```

Then open a pull request.

Branch names: `feature/<short-description>`, or `fix/<short-description>` for a
bug.

Before opening a pull request:

- `npm run lint` passes in `frontend`
- `npm run build` passes in `frontend`
- No hard-coded colours — tokens only
- Checked in both Light and Cyber themes
- No `.env` or credentials committed

---

## Data model

One course has many tasks.

**courses** — `id`, `name`, `code` *(unique)*, `color`, `created_at`

**tasks** — `id`, `course_id` *(FK → courses.id)*, `title`, `description`,
`due_date`, `priority` *(low | medium | high)*, `status` *(todo | in_progress |
done)*, `created_at`, `completed_at`

Two rules are enforced by the database itself, so they hold even if an
application-level check is missed:

- `courses.code` is `UNIQUE` — a duplicate code fails.
- `tasks.course_id` uses `ON DELETE RESTRICT` — deleting a course that still has
  tasks fails rather than silently destroying them. Catch the error and return a
  clear message.

> Validation such as "due date cannot be in the past" belongs in the
> `POST /api/tasks` handler, not the database — `seed.sql` inserts directly and
> must be able to create overdue rows for testing.

---

## Troubleshooting

**`Could not connect to MySQL`**
MySQL isn't running, or `backend/.env` is wrong. Check the service is up and
that `DB_USER` / `DB_PASSWORD` match your local install.

**`ER_BAD_DB_ERROR: Unknown database`**
You haven't created the schema yet — run step 2 of Getting started.

**Frontend calls return 404 or HTML instead of JSON**
The backend isn't running. Start it on port 4000; the Vite proxy expects it there.

**Dates arrive as `2026-09-07T00:00:00.000Z` instead of `2026-09-07`**
The pool sets `dateStrings: true`, so MySQL returns plain `YYYY-MM-DD`. If you
see a timestamp, something wrapped the value in `new Date()` — don't.

**Deleting a course returns a 500**
That is `ON DELETE RESTRICT` doing its job. Catch the `ER_ROW_IS_REFERENCED_2`
error and return a 409 with a clear message.

**Styles look unstyled or colours are wrong**
Make sure your component imports its own `.css` file, and that you're using token
variables rather than literal hex values.
