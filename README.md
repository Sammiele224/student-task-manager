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
mysql -u root -p < backend/db/SeedData.sql
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
code just calls `fetch('/api/v1/courses')` — no host, no CORS handling.

> One file still breaks this: `src/api/CourseApi.js` hard-codes
> `http://localhost:4000`, so it bypasses the proxy and leans on the backend's
> CORS allowance. It works locally and breaks anywhere else. New code should use
> a relative path, the way `TaskApi.js` does.

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

Everything is mounted under **`/api/v1`**. `/api/health` is the one exception —
it sits outside the version prefix.

```
GET    /api/v1/courses             list courses, each with taskCount +
                                   completedTaskCount
POST   /api/v1/courses             create course
PUT    /api/v1/courses/:id         update course
DELETE /api/v1/courses/:id         delete course

GET    /api/v1/tasks               list tasks
                                   ?search= &courseId= &status= &priority=
                                   &sort=dueDate &order=asc
POST   /api/v1/tasks               create task
GET    /api/v1/tasks/:id           one task
PUT    /api/v1/tasks/:id           update task
DELETE /api/v1/tasks/:id           delete task
PATCH  /api/v1/tasks/:id/status    change status only

GET    /api/v1/stats               dashboard numbers
GET    /api/health                 server + database check
```

### Response envelope

Every route under `/api/v1` wraps its payload:

```json
{ "success": true, "data": [ ... ] }
{ "success": true, "message": "Task updated successfully" }
{ "success": false, "message": "Course not found." }
```

The two server-level handlers are the exception — an unmatched path and an
unhandled throw both answer `{ "error": "..." }`, without `success`.

### Conventions

| Thing             | Convention                                                      |
| ----------------- | --------------------------------------------------------------- |
| **Dates**         | ISO `YYYY-MM-DD` everywhere — request, response, database         |
| **Field names**   | `camelCase` in JSON (`courseId`, `dueDate`), `snake_case` in SQL |
| **Priority**      | `"low"` \| `"medium"` \| `"high"`                                |
| **Status**        | `"todo"` \| `"in_progress"` \| `"done"`                          |
| **Errors**        | Non-2xx with `{ "success": false, "message": "..." }` from a route; `{ "error": "..." }` from the server's 404 and error handlers |
| **Overdue**       | `due_date < today AND status != 'done'`                          |
| **Due this week** | `due_date` within the next 7 days, inclusive of today            |

### `GET /api/v1/stats` response shape

```json
{
  "success": true,
  "data": {
    "totalTasks": 35,
    "completedCount": 22,
    "overdueCount": 3,
    "dueThisWeekCount": 8,
    "completionRate": 62
  }
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
| `/profile`   | Profile     |
| `/signin`    | Sign in — renders outside `AppLayout`, so no sidebar or topbar |
| anything else | Not found  |

---

## Project structure

```
student-task-manager/
├── frontend/
│   └── src/
│       ├── api/             CourseApi.js, TaskApi.js — every fetch lives here
│       ├── components/
│       │   ├── ui/          Button, IconButton, Input, Select, Card, Badge  ← reuse these
│       │   ├── layout/      AppLayout, Sidebar, Topbar, PageContainer, PageHeader
│       │   └── features/    Courses/, Tasks/, Calendar/, Overview/ — page-specific parts
│       ├── pages/           One file per route
│       ├── hooks/           Shared hooks (useClickOutside)
│       ├── styles/          tokens.css + global.css, then features/ per area
│       ├── theme/           Light / Cyber theme provider
│       ├── App.jsx          Route table
│       └── main.jsx         Entry point
│
└── backend/
    ├── db/
    │   ├── schema.sql       Tables (run this first)
    │   └── SeedData.sql     Demo data
    └── src/
        ├── routes/          courses.js, tasks.js, stats.js
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
import { Button, IconButton, Input, Select, Card, Badge } from '../components/ui'
import { PageContainer, PageHeader } from '../components/layout'
```

| Component | Key props                                                                 |
| --------- | ------------------------------------------------------------------------- |
| `Button`  | `variant` `primary\|secondary\|ghost\|danger`, `size` `sm\|md\|lg`, `iconLeft`, `iconRight`, `loading`, `fullWidth`, `as` |
| `Input`   | `label`, `hint`, `error`, `required`, `optional`, `icon`, `as="textarea"`  |
| `Select`  | `label`, `options={[{value,label}]}`, `placeholder`, `error`, `required`   |
| `Card`    | `eyebrow`, `title`, `action`, `footer`, `padding` `none\|sm\|md\|lg`, `tone` `default\|subtle\|outline`, `hoverable` |
| `Badge`   | `tone` `neutral\|green\|high\|medium\|low\|overdue\|done`, `dot`, `dotColor` |

`Badge` carries the status colours: `overdue` and `high` are red, `medium`
amber, `low` and `done` green. Leave `tone` off and it reads the child text —
`"high"`, `"todo"`, `"in_progress"` and friends all map to the right tone.

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
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--ink);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

| Purpose             | Variable                                                      |
| ------------------- | ------------------------------------------------------------- |
| Surfaces            | `--bg` (page), `--surface` (card), `--sidebar`, `--input`      |
| Text                | `--ink`, `--subtle`, `--muted`, `--faint` — darkest to lightest |
| Text on a fill      | `--on-primary`, `--on-danger`, `--inverse`                     |
| Brand action        | `--green`, `--green-hover`, `--green-soft`                     |
| Secondary accent    | `--accent`, `--accent-soft` — a different hue, not the brand   |
| Status              | `--danger`, `--warning`, `--success`, `--neutral` (+ each `-bg` and `-line`) |
| Course colours      | `--course-software`, `--course-design`, `--course-data`, `--course-math` |
| Lines               | `--line`, `--line-strong`                                      |
| Hero / overlay      | `--hero-base`, `--hero-accent`, `--overlay`, `--photo-scrim`   |
| Elevation           | `--shadow-sm\|md\|lg`, `--focus-ring`                          |
| Type                | `--font-display`, `--font-sans`, `--text-xs` … `--text-4xl`    |
| Spacing             | `--space-1` … `--space-16`                                     |
| Radii               | `--radius-sm\|md\|lg\|xl\|pill`                                |

Two pairs are easy to mix up:

- **`--green` is the brand; `--accent` is not.** The brand green drives buttons,
  links and active nav. `--accent` is a separate hue that reads purple in Cyber,
  so reaching for it to mean "our colour" breaks the dark theme. Soft brand
  backgrounds are `--green-soft`, not `--accent-soft`.
- **Status fills end in `-bg`, status borders in `-line`** — `--danger-bg` behind
  `--danger` text, never `--danger` as a background.

### Themes

Two themes: **Light** (soft green-tinted white, forest green) and **Cyber**
(near-black, mint). The switch is at the bottom of the sidebar. It follows the
operating system preference until someone picks one, then remembers it.

`data-theme` on `<html>` is either `light` or `cyber`; `tokens.css` also
answers to `dark` as an alias so a token block works either way.

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
> `POST /api/v1/tasks` handler, not the database — `SeedData.sql` inserts
> directly and must be able to create overdue rows for testing.

---

## Troubleshooting

**`Could not connect to MySQL`**
MySQL isn't running, or `backend/.env` is wrong. Check the service is up and
that `DB_USER` / `DB_PASSWORD` match your local install.

**`ER_BAD_DB_ERROR: Unknown database`**
You haven't created the schema yet — run step 2 of Getting started.

**Frontend calls return 404 or HTML instead of JSON**
The backend isn't running — start it on port 4000, where the Vite proxy expects
it. If the server *is* up, check the path: routes live under `/api/v1/...`, and
`/api/courses` without the version prefix returns the 404 handler's
`{ "error": "Not found" }`.

**Dates arrive as `2026-09-07T00:00:00.000Z` instead of `2026-09-07`**
The pool sets `dateStrings: true`, so MySQL returns plain `YYYY-MM-DD`. If you
see a timestamp, something wrapped the value in `new Date()` — don't.

**Deleting a course returns a 500**
That is `ON DELETE RESTRICT` doing its job. Catch the `ER_ROW_IS_REFERENCED_2`
error and return a 409 with a clear message.

**Styles look unstyled or colours are wrong**
Make sure your component imports its own `.css` file, and that you're using token
variables rather than literal hex values.
