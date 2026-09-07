# University Student Task Manager

> **THE LAST OF US** · Capstone Project · 7–18 September 2026

A web app where a student adds their courses, tracks every assignment with a due
date and a priority, and sees at a glance what is overdue and what is due this
week.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [The shared design system](#the-shared-design-system)
- [How we work together](#how-we-work-together)
- [Scope](#scope)
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

### 1. Clone and enter the project

```bash
git clone https://github.com/Sammiele224/student-task-manager.git
cd student-task-manager
```

### 2. Create the database

```bash
mysql -u root -p < backend/db/schema.sql
```

This creates the `student_task_manager` database with the `courses` and `tasks`
tables. It is safe to re-run — every statement uses `IF NOT EXISTS`.

### 3. Start the backend

```bash
cd backend
cp .env.example .env      # then fill in your MySQL password
npm install
npm run dev               # http://localhost:4000
```

Check it worked: <http://localhost:4000/api/health> should return
`{"status":"ok","database":"connected"}`.

### 4. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Vite proxies every `/api/*` request to the backend on port 4000, so frontend
code can just call `fetch('/api/courses')` with no host or CORS handling.

### Useful commands

| Where      | Command         | What it does                     |
| ---------- | --------------- | -------------------------------- |
| `frontend` | `npm run dev`   | Dev server with hot reload       |
| `frontend` | `npm run build` | Production build into `dist/`    |
| `frontend` | `npm run lint`  | ESLint — must pass before a PR   |
| `backend`  | `npm run dev`   | API server, restarts on save     |
| `backend`  | `npm start`     | API server, no watch             |

---

## Project structure

```
student-task-manager/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/          Button, Input, Select, Card, Badge  ← reuse these
│       │   └── layout/      AppLayout, Sidebar, Topbar, PageContainer, PageHeader
│       ├── pages/           One file per route (placeholders for now)
│       ├── styles/          tokens.css (colours, type, spacing) + global.css
│       ├── theme/           Light / Cyber theme provider
│       ├── App.jsx          Route table
│       └── main.jsx         Entry point
│
└── backend/
    ├── db/schema.sql        MySQL tables
    └── src/
        ├── server.js        Express app — add your routers here
        └── db.js            Shared MySQL connection pool
```

---

## The shared design system

**Everyone reuses these. Please do not hand-roll buttons, inputs or card
surfaces** — if something is missing, extend the shared component in its own PR
so the whole team gets it.

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

### What a page looks like

Every page follows the same skeleton, which is what keeps the app feeling like
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
colour** — use the CSS variable, and both themes work for free:

```css
.my-thing {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

Most-used tokens:

| Purpose            | Variable                                                    |
| ------------------ | ----------------------------------------------------------- |
| Page / card / panel| `--bg-page`, `--bg-surface`, `--bg-surface-subtle`          |
| Text               | `--text-primary`, `--text-secondary`, `--text-muted`         |
| Brand action       | `--accent`, `--accent-hover`, `--accent-contrast`, `--accent-soft` |
| Status             | `--danger`, `--warning`, `--success` (+ each `-soft`)        |
| Course colours     | `--course-green`, `--course-purple`, `--course-amber`, `--course-blue` |
| Borders            | `--border`, `--border-strong`                                |
| Spacing            | `--space-1` … `--space-16` (4px scale)                       |
| Radii              | `--radius-sm\|md\|lg\|xl\|pill`                              |

### Themes

Two themes ship with the app: **Light** (warm paper, forest green) and **Cyber**
(near-black, mint). The switch lives at the bottom of the sidebar. It follows
the operating system preference until someone picks one, then remembers it.

Because everything reads from tokens, you never write theme-specific CSS.

> **Note on styling approach:** the team hasn't settled on Tailwind vs. plain CSS
> yet. Plain CSS keeps that door open — the token palette in `tokens.css` maps
> directly onto a Tailwind theme config later, and only component files would
> change.

---

## How we work together

`main` is protected. **You cannot push to it directly.**

```bash
git checkout main
git pull
git checkout -b feat/us-01-add-course

# ...work, commit...

git push -u origin feat/us-01-add-course
```

Then open a Pull Request on GitHub. It needs **1 approving review** before it
can merge.

### Branch naming

`<type>/<story-id>-<short-description>`

| Type    | Use for              | Example                       |
| ------- | -------------------- | ----------------------------- |
| `feat`  | A user story         | `feat/us-05-add-task`         |
| `fix`   | A bug                | `fix/us-10-overdue-highlight` |
| `chore` | Tooling, config, docs| `chore/eslint-config`         |

### Before you open a PR

- [ ] `npm run lint` passes in `frontend`
- [ ] `npm run build` passes in `frontend`
- [ ] You reused the shared components instead of writing new buttons/inputs
- [ ] No hard-coded colours — tokens only
- [ ] Checked the page in **both** Light and Cyber themes
- [ ] `.env` is not committed

### Reviewing

Every PR needs one teammate's approval. Review promptly — a blocked PR blocks a
person. Leave a comment even when you approve.

---

## Scope

### Must have

| ID    | Feature       | Story                                              |
| ----- | ------------- | -------------------------------------------------- |
| US-01 | Course CRUD   | Add a course (unique code enforced)                 |
| US-02 | Course CRUD   | List courses, with an empty state                   |
| US-03 | Course CRUD   | Edit a course                                       |
| US-04 | Course CRUD   | Delete a course (warn if it still has tasks)        |
| US-05 | Task CRUD     | Add a task (course, title, due date required)       |
| US-06 | Task CRUD     | List tasks with course, due date, priority, status  |
| US-07 | Task CRUD     | Edit a task                                         |
| US-08 | Task CRUD     | Delete a task                                       |
| US-09 | Task status   | todo → in progress → done, records completion time  |
| US-10 | Upcoming view | Sorted by due date, overdue highlighted in red      |
| US-11 | Search        | Search tasks by title, case-insensitive             |
| US-12 | Filters       | Filter by course, priority and status; combinable   |
| US-13 | Dashboard     | Total, overdue, due this week, completion rate      |

### Nice to have

- **US-14 — Student login.** Day 8 only, and only if the MVP is stable.

### Out of scope

Mobile app · push notifications · Google Calendar sync · file attachments ·
sharing tasks between students · recurring tasks.

---

## Data model

One course has many tasks.

**courses** — `id`, `name`, `code` *(unique)*, `color`, `created_at`

**tasks** — `id`, `course_id` *(FK → courses.id)*, `title`, `description`,
`due_date`, `priority` *(low | medium | high)*, `status` *(todo | in_progress |
done)*, `created_at`, `completed_at`

Two rules are enforced by the database itself, so they hold even if an
application-level check is missed:

- `courses.code` is `UNIQUE` — a duplicate code fails (US-01, US-03).
- `tasks.course_id` uses `ON DELETE RESTRICT` — deleting a course that still has
  tasks fails rather than silently destroying them (US-04).

---

## Troubleshooting

**`Could not connect to MySQL`**
MySQL isn't running, or `backend/.env` is wrong. Check the service is up and
that `DB_USER` / `DB_PASSWORD` match your local install.

**`ER_BAD_DB_ERROR: Unknown database`**
You haven't created the schema yet — run step 2 of Getting started.

**Frontend calls return 404 / HTML instead of JSON**
The backend isn't running. Start it on port 4000; the Vite proxy expects it
there.

**Styles look unstyled or colours are wrong**
Make sure your component imports its own `.css` file, and that you're using
token variables rather than literal hex values.

---

## Team

**THE LAST OF US** — 7 members · 10 business days · 7–18 September 2026
