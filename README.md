# University Student Task Manager

A web app where a student adds their courses, then tracks every assignment with
a due date and a priority, and sees at a glance what is overdue and what is due
this week.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Frontend routes](#frontend-routes)
- [Project structure](#project-structure)
- [The shared design system](#the-shared-design-system)
- [Branching](#branching)
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

You need **Node.js 18+**. The backend also needs **MySQL 8** once it is built.

### 1. Clone

```bash
git clone https://github.com/Sammiele224/student-task-manager.git
cd student-task-manager
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

That is enough to see the app. Every page is a placeholder until the features
are built.

### 3. The backend

`backend/` is a skeleton: the folders, `package.json` and `.env.example` are in
place, and the source files are empty for the backend team to write.

```bash
cd backend
cp .env.example .env      # then fill in your MySQL credentials
npm install
```

Vite proxies every `/api/*` request to port 4000, so once a server is running
there, frontend code can call `fetch('/api/v1/courses')` with no host and no
CORS handling.

### Commands

| Where      | Command         | What it does                   |
| ---------- | --------------- | ------------------------------ |
| `frontend` | `npm run dev`   | Dev server with hot reload     |
| `frontend` | `npm run build` | Production build into `dist/`  |
| `frontend` | `npm run lint`  | ESLint                         |
| `backend`  | `npm run dev`   | API server, restarts on save   |
| `backend`  | `npm start`     | API server, no watch           |

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
└── backend/             Skeleton — source files are empty
    ├── db/
    │   └── schema.sql
    └── src/
        ├── routes/v1/
        ├── server.js
        └── db.js
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

## Troubleshooting

**Frontend calls return 404 or HTML instead of JSON**
No server is running on port 4000 yet. The Vite proxy forwards `/api/*` there,
so until the backend exists those calls have nowhere to go.

**Styles look unstyled or colours are wrong**
Make sure your component imports its own `.css` file, and that you are using
token variables rather than literal hex values.

**A colour looks right in Light and wrong in Cyber**
Something is hard-coded. Every colour must come from `styles/tokens.css` — that
is what makes both themes work without theme-specific CSS.

**`npm run dev` in `backend/` does nothing**
Expected. `src/server.js` is empty until the backend team writes it.
