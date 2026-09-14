import { useMemo, useState } from 'react'
import { CalendarDays, Plus } from 'lucide-react'
import { useTasks } from '../components/features/Tasks/TaskContext'
import TaskListPanel from '../components/features/Tasks/TaskListPanel'
import { EditTaskModal } from '../components/features/Tasks/EditTaskModal'
import { CreateTaskModal } from '../components/features/Tasks/CreateTaskModal'
import { TaskMessageDialog } from '../components/features/Tasks/TaskMessageDialog'
import { isTaskOverdue, STATUS_META } from '../components/features/Tasks/taskMeta'
import { isOnHorizon } from '../components/features/Tasks/taskStats'
import { PageContainer, PageHeader } from '../components/layout'
import { Button } from '../components/ui'

import '../styles/features/Task/Tasks.css'
/* CourseForm.css holds the modal shell and base field styles despite its name. */
import '../styles/features/Course/CourseForm.css'
import '../styles/features/Task/TaskForm.css'
import '../styles/features/Task/Upcoming.css'

/* A deadline view only ever shows unfinished work, so "Done" would filter
   every row away. The board drops its Done column for the same reason. */
const OPEN_STATUS_OPTIONS = ['todo', 'in_progress'].map((value) => ({
  value,
  label: STATUS_META[value].label,
}))

const TABS = [
  { key: 'all', label: 'All upcoming' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'horizon', label: 'Next 7 days' },
]

const EMPTY_COPY = {
  all: {
    title: 'Nothing on the horizon.',
    text: 'Every deadline is behind you. Add a task when the next one lands.',
  },
  overdue: {
    title: 'Nothing overdue.',
    text: "You're on top of every deadline. That's worth a moment.",
  },
  horizon: {
    title: 'A clear week ahead.',
    text: 'Nothing falls due in the next seven days.',
  },
}

/** "2 overdue assignments need a little attention." */
function overdueLine(count) {
  if (count === 0) return "Nothing is overdue. You're right on track."
  if (count === 1) return '1 overdue assignment needs a little attention.'
  return `${count} overdue assignments need a little attention.`
}

/** "4 tasks on your horizon this week" */
function horizonLine(count) {
  if (count === 0) return 'Nothing on your horizon this week'
  if (count === 1) return '1 task on your horizon this week'
  return `${count} tasks on your horizon this week`
}

export default function Upcoming() {
  const { tasks, courses, loading, error, clearError, addTask, updateTask, deleteTask, toggleDone, setTaskStatus } =
    useTasks()

  const [tab, setTab] = useState('all')
  const [creating, setCreating] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  /* A task without a due date has no place on a deadline list. */
  const openTasks = useMemo(
    () => tasks.filter((t) => t.status !== 'done' && t.dueDate),
    [tasks]
  )

  const overdueTasks = useMemo(() => openTasks.filter(isTaskOverdue), [openTasks])
  const horizonTasks = useMemo(() => openTasks.filter(isOnHorizon), [openTasks])

  const scoped = { all: openTasks, overdue: overdueTasks, horizon: horizonTasks }[tab]

  const handleConfirmDelete = async () => {
    const id = taskToDelete.id
    setTaskToDelete(null)
    setEditingTask(null)
    try {
      await deleteTask(id)
    } catch {
      /* The context holds the reason and shows it above the list. */
    }
  }

  /* A new task starts as to-do and due in the future, so it belongs on this
     page. Show it where it landed rather than leaving the reader on a tab
     that filters it out. */
  const handleCreate = async (values) => {
    await addTask(values)
    setTab('all')
  }

  const handleStatusChange = async (id, status) => {
    try {
      await setTaskStatus(id, status)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  const handleToggleDone = async (id) => {
    try {
      await toggleDone(id)
    } catch {
      /* Already rolled back and reported by the context. */
    }
  }

  return (
    <PageContainer className="tasks-page">
      <PageHeader
        eyebrow="A little look ahead"
        title="Stay a step ahead."
        subtitle="Your deadlines, in order. A clearer view of what needs you next."
        actions={
          <Button iconLeft={<Plus size={16} />} onClick={() => setCreating(true)}>
            New task
          </Button>
        }
      />

      {error && (
        <div className="tasks-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <section className="upcoming-horizon">
        <span className="upcoming-horizon-icon" aria-hidden="true">
          <CalendarDays />
        </span>
        <div>
          <h2 className="upcoming-horizon-title">{horizonLine(horizonTasks.length)}</h2>
          <p className="upcoming-horizon-sub">{overdueLine(overdueTasks.length)}</p>
        </div>
      </section>

      <div className="upcoming-tabs" role="tablist" aria-label="Deadline range">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`upcoming-tab-${key}`}
            aria-selected={tab === key}
            aria-controls="upcoming-panel"
            className={`upcoming-tab ${tab === key ? 'is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {key === 'overdue' && overdueTasks.length > 0 ? `${label} (${overdueTasks.length})` : label}
          </button>
        ))}
      </div>

      <div id="upcoming-panel" role="tabpanel" aria-labelledby={`upcoming-tab-${tab}`}>
        <TaskListPanel
          tasks={scoped}
          courses={courses}
          loading={loading}
          statusOptions={OPEN_STATUS_OPTIONS}
          emptyTitle={EMPTY_COPY[tab].title}
          emptyText={EMPTY_COPY[tab].text}
          onToggleDone={handleToggleDone}
          onStatusChange={handleStatusChange}
          onEdit={setEditingTask}
        />
      </div>

      <CreateTaskModal
        open={creating}
        courses={courses}
        onClose={() => setCreating(false)}
        onCreate={handleCreate}
      />

      <EditTaskModal
        open={Boolean(editingTask)}
        task={editingTask}
        courses={courses}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onDelete={setTaskToDelete}
      />

      <TaskMessageDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        message={`“${taskToDelete?.title}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete task"
        tone="danger"
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  )
}
